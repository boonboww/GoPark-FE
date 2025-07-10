export interface Vehicle {
  _id?: string; // Thêm trường này cho MongoDB
  licensePlate: string;
  capacity: number;
  imageVehicle: string;
  // Không cần userId ở frontend
}