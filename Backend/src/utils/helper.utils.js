import { nanoid } from "nanoid";

export const generateNanoId = (length) => {
    return nanoid(length);
}