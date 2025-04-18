import env from "./util/validateEnv";

const mongoURI = env.MONGODB_URI;
const port = env.PORT;

export { mongoURI, port };
