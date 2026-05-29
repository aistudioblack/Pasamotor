// @ts-expect-error - compiled server.cjs is generated at production build
import app from "../dist/server.cjs";
export default (app.default || app);
