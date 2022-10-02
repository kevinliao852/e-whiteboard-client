import ReactDom from "react-dom";
import { App } from "./component/App";
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
