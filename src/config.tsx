const REGION = process.env.REACT_APP_REGION;
const OAUTH_DOMAIN = `${process.env.REACT_APP_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

const config = {
  cognito: {
    REGION: REGION,
    USER_POOL_ID: process.env.REACT_APP_COG_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COG_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_COG_IDENTITY_POOL_ID,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scope: ["email", "aws.cognito.signin.user.admin", "openid", "profile"],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_OUT,
      responseType: "code",
    },
  }
};

export default config;
