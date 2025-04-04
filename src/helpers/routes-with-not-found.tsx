import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../models/routes";

interface Props {
    children: JSX.Element[] | JSX.Element;
}

function RoutesWithNotFound({children}: Props) {
  return (
    <>
      <Routes>
        {children}
        <Route path="*" element={<Navigate replace to={`/${PrivateRoutes.PRIVATE}`} />} />
      </Routes>
    </>
  );
}

export default RoutesWithNotFound;