
let url="https://localhost:44396/api/Departments/allDepartments";

async function getAllDepartments()
{
    try {
        let request = await fetch(url);

        // If the response is not okay, handle the error
        if (!request.ok) {
            throw new Error("Failed to fetch data");
        }
        let data = await request.json();

        let container = document.getElementById("departments-container"); // make sure 'department-container' exists in your HTML
        
        // Check if data is empty
        if (!data || data.length === 0) {
            console.log("No departments found");
            return;
        }
 
    data.forEach(department => {

        container.innerHTML+=`

           <div class="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                    <div class="case-item position-relative overflow-hidden rounded mb-2 fixed-size">
                        <img class="img-fluid" src="../backend/Auera-Cura/Auera-Cura/Uploads/${department.image}" alt="${department.departmentName}">
                        <a class="case-overlay text-decoration-none" href="department-details.html?id=${department.departmentId}" onclick="storeDepartmentId(${department.departmentId})">
                            <small>${department.departmentName}</small>
                            <span class="btn btn-square btn-primary"><i class="fa fa-arrow-right"></i></span>
                        </a>
                    </div>
                </div>
        
        
        `
        
    });
}catch (error) {
    console.error("Error fetching departments", error);
}

}

// دالة لحفظ الـ departmentId في الـ localStorage
function storeDepartmentId(departmentId) {
    localStorage.setItem("selectedDepartmentId", departmentId); // تخزين الـ departmentId
}
getAllDepartments();