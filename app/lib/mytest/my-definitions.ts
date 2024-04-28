import { StringDecoder } from "string_decoder";

export type Weather = {
    city: string;
    temp_lo: number;
    temp_hi: number;
    prcp: boolean;
    date:string
};