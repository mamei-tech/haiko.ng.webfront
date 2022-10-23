import type { IStaffDto } from '@/services/definitions'


export default function useFactory() {

    //#region ======= FACTORY METHODS =====================================================

    const mkStaff = (): IStaffDto => {
        return {
            id: 0,
            firstName: '',
            username: '',
            roleId: 0,
            isActive: true,
            cell: 0,
            avatarPath: '',
            lastName: '',
            email: '',
            locale: '',
            password: '',
            passwordConf: '',
        }
    }

    //#endregion ==========================================================================

    return {
        mkStaff
    }
}


