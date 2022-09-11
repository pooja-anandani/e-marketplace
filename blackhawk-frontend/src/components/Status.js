import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "./Accounts";

const Status = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const { getSession, logout } = useContext(AccountContext);
  const onClick = (e) => {
    logout.then(localStorage.clear(), navigate("/"));
  };
  useEffect(() => {
    getSession().then((session) => {
      console.log("Session:", session);
      setStatus(true);
    });
  }, []);
  return (
    <div>
      {status ? (
        <div>
          You are logged in.
          <button onClick={onClick}>Logout</button>
        </div>
      ) : (
        "Please login below."
      )}
    </div>
  );
};

export default Status;
