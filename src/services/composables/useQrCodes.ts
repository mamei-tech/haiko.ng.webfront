import QRCode from 'qrcode-generator'

import type { IvCard } from '@/services/definitions/types-common'


export default function useQrCodes() {

    /**
     * Create vCard v4 contact QrCode image
     * references: https://github.com/joonhocho/vcard-generator
     *
     * @param info contact information data will be used to create the vcard
     */
    const mkVCardQrImg = ( info: IvCard ): string => {

        // --- building the vCard string
        let str_vName = `N:${ info.name.familyName ? info.name.familyName + ';' : '' }${ info.name.givenName ? info.name.givenName + ';' : '' }${ info.name.middleName ? info.name.middleName + ';' : '' }${ info.name.prefix ? info.name.prefix + ';' : '' }${ info.name.suffix ? info.name.suffix + ';' : '' }\n`
        let str_vNickName = !info.nickname ? '' : `NICKNAME:${ info.nickname }\n`
        let str_vWorkOrg = !info.work ? '' : `ORG:${ info.work.organization }\n`
        let str_vWorkTitle = !info.work?.title ? '' : `TITLE:${ info.work.title }\n`
        let str_vWorkRole = !info.work?.role ? '' : `ROLE:${ info.work.role }\n`              // ! in supplier case use contact notes

        let str_vEmails = ''
        if (info.emails && info.emails?.length > 0)
            for (let i = 0; i < info.emails.length; i++)
                str_vEmails += `EMAIL;PREF=${ i + 1 }${ !info.emails[ i ].type ? '' : ';TYPE=' + info.emails[ i ].type }:${ info.emails[ i ].text }\n`

        let str_vPhones = ''
        if (info.phones && info.phones?.length > 0)
            for (let i = 0; i < info.phones.length; i++)
                str_vPhones += `TEL;PREF=${ i + 1 }${ !info.phones[ i ].type ? '' : ';TYPE=' + info.phones[ i ].type }:${ info.phones[ i ].text }\n`

        let str_vAddresses = ''
        if (info.addresses && info.addresses?.length > 0)
            for (let i = 0; i < info.addresses.length; i++)
                str_vPhones += `ADR;PREF=${ i + 1 }${ !info.addresses[ i ].type ? '' : ';TYPE=' + info.addresses[ i ].type }:;;${ info.addresses[ i ].street ?? '' };${ !info.addresses[ i ].locality ? '' : info.addresses[ i ].locality };${ !info.addresses[ i ].region ? '' : info.addresses[ i ].region };${ !info.addresses[ i ].code ? '' : info.addresses[ i ].code };${ !info.addresses[ i ].country ? '' : info.addresses[ i ].country }\n`

        let str_vNote = !info.note?.text ? '' : `NOTE;PREF=1:${ info.note.text }\n`

        const str = `BEGIN:VCARD\n` +
                    `VERSION:4.0\n` +
                    `${str_vName}${str_vNickName}${str_vWorkOrg}${str_vWorkTitle}${str_vWorkRole}${str_vEmails}${str_vPhones}${str_vAddresses}${str_vNote}` +
                    `END:VCARD`

        // --- making the QR with the just build string
        const qrVcard = QRCode(0, 'H')
        qrVcard.addData(str)
        qrVcard.make()

        return qrVcard.createDataURL()
    }

    // --- returning data

    return {
        mkVCardQrImg
    }
}

