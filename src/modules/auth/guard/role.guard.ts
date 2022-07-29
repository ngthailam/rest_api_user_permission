import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { roleConstants } from "src/modules/role/constants";
import { RoleService } from "src/modules/role/role.service";
import { UserService } from "src/modules/user/user.service";

export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject(RoleService) private readonly roleService: RoleService,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(JwtService) private readonly jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>()
        const authorization = (request.headers as any).authorization

        if (!authorization) return false

        const decodedJwt = this.jwtService.decode(authorization.split(' ')[1]) as any;
        const userId = decodedJwt.id;

        if (!userId) return true

        const requiredRoleNames = this.reflector.getAllAndOverride<string[]>(roleConstants.roleName, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoleNames) return true

        if (requiredRoleNames.length == 0) return true

        const user = await this.userService.findOne(userId)
        const userRoleNames = user.roles.map(e => e.name);
        let hasRole: boolean = true

        for (const requiredRoleName of requiredRoleNames) {
            if (!userRoleNames.includes(requiredRoleName)) {
                console.log('false')
                return false
            }
        }

        return hasRole
    }
}