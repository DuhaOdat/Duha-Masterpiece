using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly TokenGenerator _tokenGenerator;

        public UsersController( MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("Register")]
        public IActionResult addNewUser([FromForm] UsersRegistrationDTO userDTO)
        {

            byte[] hash;
            byte[] salt;
            PasswordHasher.CreatePasswordHash(userDTO.Password, out hash, out salt);

            User user = new User
            {
                FirstName = userDTO.FirstName,
                LastName = userDTO.LastName,
                Email = userDTO.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                CreatedAt = DateTime.Now,
                Role = "Patient"

            };

            _db.Users.Add(user);
            _db.SaveChanges();
            return Ok(new {user});
        }




      


        [HttpPost("Login")]
        public IActionResult Login([FromForm] UsersLoginDTO userDTO)
        {
           
            var user = _db.Users.FirstOrDefault(u => u.Email == userDTO.Email);
            if (user == null || !PasswordHasher.VerifyPasswordHash(userDTO.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid");
            }

            // Get the role directly from the user object
            var role = user.Role;
            var token = _tokenGenerator.GenerateToken(user.Email, new List<string> { role });

            if(userDTO.Password == "password")
            {return Ok(new
                {
                    Token = token,

                    Role = role,
                    UserId = user.Id,
                    goTo = "OTP"
                });

            }
            else
            {
                return Ok(new
                {
                    Token = token,

                    Role = role,
                    UserId = user.Id,
                    goTo = "Dashboard"
                });

            }

            

        }


        [HttpPost("RoleRegister")]
        public IActionResult RegisterUser([FromForm] AdminUserRegistrationDTO userDto)
        {
            // تشفير كلمة المرور باستخدام PasswordHasher المخصص
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash("password", out passwordHash, out passwordSalt);

            // إنشاء المستخدم وحفظه في قاعدة البيانات
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PasswordHash = passwordHash,  // تخزين الـ Password Hash
                PasswordSalt = passwordSalt,  // تخزين الـ Password Salt
                Role = userDto.Role,          // تخزين الدور
                CreatedAt = DateTime.Now
            };

            // إضافة المستخدم إلى جدول Users
            _db.Users.Add(user);
            _db.SaveChanges();

            // Get the newly created UserID
            int UserID = user.Id;

      
            if (userDto.Role == "Doctor")
            {
                var doctor = new Doctor
                {
                   
                    Email = userDto.Email,
                    UserId = UserID,  // Store the UserID as a foreign key in the Doctors table
                                     
                };

                // إضافة البيانات إلى جدول الأطباء
                _db.Doctors.Add(doctor);
                 _db.SaveChanges();
            }

            return Ok(new { message = "add user succesfully" });
        }


        [HttpGet("GetUsersExceptPatients")]
        public IActionResult GetUsersExceptPatients()
        {
            // استرجاع جميع المستخدمين الذين لا يكون دورهم "Patient"
            var users = _db.Users
                           .Where(u => u.Role != "Patient")
                           .Select(u => new
                           {
                               u.Id,
                               u.FirstName,
                               u.LastName,
                               u.Email,
                               u.Role,
                               u.CreatedAt
                           })
                           .ToList();

            return Ok(users);
        }

        [HttpDelete("DeleteUser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            // البحث عن المستخدم بواسطة الـ ID
            var user = _db.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var doctorEntries = _db.Doctors.Where(d => d.UserId == id);
            _db.Doctors.RemoveRange(doctorEntries);
            _db.Users.Remove(user);
            _db.SaveChanges();

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("UpdateUser/{id}")]
        public IActionResult UpdateUser(int id, [FromForm] UpdateUserDTO userDto)
        {
            // البحث عن المستخدم بواسطة الـ ID
            var user = _db.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // تحديث بيانات المستخدم
            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.Role = userDto.Role;
           

            _db.Users.Update(user);
            _db.SaveChanges();

            // إذا كان الدور محدثًا إلى "Doctor"، يتم التحقق من جدول الأطباء
            if (userDto.Role == "Doctor")
            {
                var doctor = _db.Doctors.FirstOrDefault(d => d.UserId == id);
                if (doctor == null)
                {
                    // إذا لم يكن الطبيب موجودًا في جدول الأطباء، يتم إضافته
                    doctor = new Doctor
                    {
                        Email = userDto.Email,
                        UserId = user.Id
                    };
                    _db.Doctors.Add(doctor);
                }
                else
                {
                    // إذا كان موجودًا، يتم تحديث البيانات
                    doctor.Email = userDto.Email;
                    _db.Doctors.Update(doctor);
                }
                _db.SaveChanges();
            }
            else
            {
                // إذا لم يكن المستخدم دكتورًا ويتم تحديث دوره، يتم إزالة السجل من جدول الأطباء
                var doctor = _db.Doctors.FirstOrDefault(d => d.UserId == id);
                if (doctor != null)
                {
                    _db.Doctors.Remove(doctor);
                    _db.SaveChanges();
                }
            }

            return Ok(new { message = "User updated successfully" });
        }

    }
}
