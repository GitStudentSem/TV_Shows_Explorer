import { Screens } from "./Screens/Screens";
import { Toast } from "./Toast/Toast";

/** Корень приложения: только каркас. Начинка — в Screens. */
export default function App() {
  return (
    <>
      <Screens />
      <Toast />
    </>
  );
}
