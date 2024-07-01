/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./modules/auth/dtos/create-user.dto"), { "CreateUserDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String }, isEnabled: { required: false, type: () => Boolean, default: true } } }], [import("./modules/auth/dtos/credentials-user.dto"), { "CredentialsUserDto": {} }]], "controllers": [[import("./modules/auth/auth.controller"), { "AuthController": { "singIn": {}, "SingUp": {} } }]] } };
};