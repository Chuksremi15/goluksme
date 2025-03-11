import jwt from "jsonwebtoken";

export const generateToken = (address) => {
  return jwt.sign({ address }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const getAddressFromToken = (req) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw Error("Unauthorized");
    }
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    const { address } = jwtPayload;
    return address;
  } catch (e) {
    throw Error(e);
  }
};
