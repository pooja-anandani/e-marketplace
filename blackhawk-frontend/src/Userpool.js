import {CognitoUserPool} from 'amazon-cognito-identity-js'

const poolConfig = {
    UserPoolId:"us-east-1_OOoJxifLM",
    ClientId:"4scmvp6uj6l5eoig5fv2vvecnk"
  };

const UserPool = new CognitoUserPool(poolConfig)
export default UserPool;
