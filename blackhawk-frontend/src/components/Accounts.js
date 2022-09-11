import React, { createContext, useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "../Userpool";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const Account = (props) => {
  const [status, setStatus] = useState(false);

  const resend = async () =>
    await new Promise((resolve, reject) => {
      const Username = localStorage.getItem("email");
      const resenduser = new CognitoUser({ Username, Pool });
      resenduser.resendConfirmationCode(function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  const confirm = async (code) =>
    await new Promise((resolve, reject) => {
      const Username = localStorage.getItem("email");
      const confirmuser = new CognitoUser({ Username, Pool });
      confirmuser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  };

  const getSession = async () =>
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
    });

  const getUserAttributes = async () =>
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            user.getUserAttributes((err, attributes) => {
              if (err) {
                reject();
              } else {
                resolve(attributes);
              }
            });
          }
        });
      } else {
        reject();
      }
    });

  const changePassword = async (oldPassword,newPassword) =>{
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            user.changePassword(oldPassword,newPassword,(err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          }
        });
      } else {
        reject();
      }
    });
  }

  const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          resolve(data);
        },

        onFailure: (err) => {
          reject(err);
        },
      });
    });

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        getUserAttributes,
        changePassword,
        logout,
        confirm,
        resend,
        status,
        setStatus,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default Account;
