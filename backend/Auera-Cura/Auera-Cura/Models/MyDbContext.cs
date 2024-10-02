using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Models;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BloodDonationRequest> BloodDonationRequests { get; set; }

    public virtual DbSet<BloodType> BloodTypes { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<DoctorSchedule> DoctorSchedules { get; set; }

    public virtual DbSet<LabTest> LabTests { get; set; }

    public virtual DbSet<LabTestOrder> LabTestOrders { get; set; }

    public virtual DbSet<LabTestResult> LabTestResults { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PatientProfile> PatientProfiles { get; set; }

    public virtual DbSet<Reward> Rewards { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-N37BUBU;Database=Auera-Cura;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BloodDonationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__BloodDon__33A8519A19F58FB7");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.BloodTypeId).HasColumnName("BloodTypeID");
            entity.Property(e => e.LabTechnicianId).HasColumnName("LabTechnicianID");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.BloodType).WithMany(p => p.BloodDonationRequests)
                .HasForeignKey(d => d.BloodTypeId)
                .HasConstraintName("FK__BloodDona__Blood__3C34F16F");

            entity.HasOne(d => d.LabTechnician).WithMany(p => p.BloodDonationRequestLabTechnicians)
                .HasForeignKey(d => d.LabTechnicianId)
                .HasConstraintName("FK__BloodDona__LabTe__3F115E1A");

            entity.HasOne(d => d.Patient).WithMany(p => p.BloodDonationRequestPatients)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("FK__BloodDona__Patie__3B40CD36");
        });

        modelBuilder.Entity<BloodType>(entity =>
        {
            entity.HasKey(e => e.BloodTypeId).HasName("PK__BloodTyp__B489BA43539B60CF");

            entity.Property(e => e.BloodTypeId).HasColumnName("BloodTypeID");
            entity.Property(e => e.BloodType1)
                .HasMaxLength(5)
                .HasColumnName("BloodType");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DepartmentId).HasName("PK__Departme__B2079BCD249DC35E");

            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.DepartmentName).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.DoctorId).HasName("PK__Doctors__2DC00EDF82D358E4");

            entity.Property(e => e.DoctorId).HasColumnName("DoctorID");
            entity.Property(e => e.AvailabilityStatus).HasMaxLength(50);
            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.Education).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.IsHead).HasColumnName("isHead");
            entity.Property(e => e.Phone).HasMaxLength(15);
            entity.Property(e => e.Specialty).HasMaxLength(100);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Department).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Doctors__Departm__4E88ABD4");

            entity.HasOne(d => d.User).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Doctor_User");
        });

        modelBuilder.Entity<DoctorSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__DoctorSc__9C8A5B6960B9EA24");

            entity.ToTable("DoctorSchedule");

            entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");
            entity.Property(e => e.DayOfWeek).HasMaxLength(20);
            entity.Property(e => e.DoctorId).HasColumnName("DoctorID");

            entity.HasOne(d => d.Doctor).WithMany(p => p.DoctorSchedules)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__DoctorSch__Docto__5165187F");
        });

        modelBuilder.Entity<LabTest>(entity =>
        {
            entity.HasKey(e => e.TestId).HasName("PK__Lab_Test__8CC3310051D4244C");

            entity.ToTable("Lab_Tests");

            entity.Property(e => e.TestId).HasColumnName("TestID");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.NormalRange).HasMaxLength(50);
            entity.Property(e => e.TestName).HasMaxLength(100);
            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        modelBuilder.Entity<LabTestOrder>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Lab_Test__C3905BAF0C8ED825");

            entity.ToTable("Lab_Test_Orders");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.DoctorUserId).HasColumnName("DoctorUserID");
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PatientUserId).HasColumnName("PatientUserID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TestId).HasColumnName("TestID");

            entity.HasOne(d => d.DoctorUser).WithMany(p => p.LabTestOrderDoctorUsers)
                .HasForeignKey(d => d.DoctorUserId)
                .HasConstraintName("FK__Lab_Test___Docto__2BFE89A6");

            entity.HasOne(d => d.PatientUser).WithMany(p => p.LabTestOrderPatientUsers)
                .HasForeignKey(d => d.PatientUserId)
                .HasConstraintName("FK__Lab_Test___Patie__2B0A656D");

            entity.HasOne(d => d.Test).WithMany(p => p.LabTestOrders)
                .HasForeignKey(d => d.TestId)
                .HasConstraintName("FK__Lab_Test___TestI__2A164134");
        });

        modelBuilder.Entity<LabTestResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__Lab_Test__97690228A11EB681");

            entity.ToTable("Lab_Test_Results");

            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.CompleteDate).HasColumnType("datetime");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Completed");
            entity.Property(e => e.UploadDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Order).WithMany(p => p.LabTestResults)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__Lab_Test___Order__30C33EC3");

            entity.HasOne(d => d.UploadedByLabTechNavigation).WithMany(p => p.LabTestResults)
                .HasForeignKey(d => d.UploadedByLabTech)
                .HasConstraintName("FK__Lab_Test___Uploa__31B762FC");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E324901F660");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__367C1819");
        });

        modelBuilder.Entity<PatientProfile>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PK__PatientP__970EC346A36B0E0B");

            entity.ToTable("PatientProfile");

            entity.HasIndex(e => e.UserId, "UQ__PatientP__1788CCAD312C7AF9").IsUnique();

            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.BloodTypeId).HasColumnName("BloodTypeID");
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.Phone).HasMaxLength(15);
            entity.Property(e => e.RewardPoints).HasDefaultValue(0);
            entity.Property(e => e.Status).HasMaxLength(30);
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.BloodType).WithMany(p => p.PatientProfiles)
                .HasForeignKey(d => d.BloodTypeId)
                .HasConstraintName("FK__PatientPr__Blood__7A672E12");

            entity.HasOne(d => d.User).WithOne(p => p.PatientProfile)
                .HasForeignKey<PatientProfile>(d => d.UserId)
                .HasConstraintName("FK__PatientPr__UserI__797309D9");
        });

        modelBuilder.Entity<Reward>(entity =>
        {
            entity.HasKey(e => e.RewardId).HasName("PK__Rewards__82501599A86794A1");

            entity.Property(e => e.RewardId).HasColumnName("RewardID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.RewardName).HasMaxLength(100);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB00AF3D83F0C");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ServiceIcon).HasMaxLength(255);
            entity.Property(e => e.ServiceLink).HasMaxLength(255);
            entity.Property(e => e.ServiceName).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC27BF53D508");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534AE6F7FC6").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("lastName");
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
