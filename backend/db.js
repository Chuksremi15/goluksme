import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOD_URL_LIVE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};
