import env from "./util/validateEnv";

const mongoURI = env.MONGO_URI;
const port = env.PORT;

export { mongoURI, port };
