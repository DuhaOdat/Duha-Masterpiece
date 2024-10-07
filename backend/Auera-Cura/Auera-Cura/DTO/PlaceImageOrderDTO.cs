namespace Auera_Cura.DTO
{
    public class PlaceImageOrderDTO
    {

            public int PatientID { get; set; }
            public int DoctorID { get; set; } // This can be fetched from localStorage as per your preference.
            public int ImageTypeID { get; set; } // Type of imaging (e.g., MRI, X-ray)
            public string Notes { get; set; }
        


    }
}
