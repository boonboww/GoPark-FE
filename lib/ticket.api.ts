import API from "./api";

export const getTicketsByParkingLotId = (
  parkingLotId: string,
  params?: {
    vehicleNumber?: string;
    ticketType?: string;
    status?: string;
    date?: string;
    keyword?: string;
  }
) => {
  return API.get(`/api/v1/tickets/parking-lot/${parkingLotId}`, {
    params,
  });
};

export const createTicket = (data: any) => {
  return API.post("/api/v1/tickets", data);
};
