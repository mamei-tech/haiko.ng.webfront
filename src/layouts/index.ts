import LayBasic from '@/layouts/LayBasic.vue'
import LayMain from '@/layouts/LayMain.vue'
import LayMainTopNav from '@/layouts/LayMainTopNav.vue'
import LayFooterContent from '@/layouts/LayFooterContent.vue'
import SbInventory from '@/layouts/sidebars/SbInventory.vue'
import SbDashNReports from '@/layouts/sidebars/SbDashNReports.vue'
import SbManagement from '@/layouts/sidebars/SbManagement.vue'
import SbProduction from '@/layouts/sidebars/SbProduction.vue'
import SbPurchase from '@/layouts/sidebars/SbPurchase.vue'
import SbPeople from '@/layouts/sidebars/SbPeople.vue'
import SbConfig from '@/layouts/sidebars/SbConfig.vue'


export {

    // views layouts
    LayBasic,                   // roots of the layouts, the most basic above main layout
    LayMain,
    LayMainTopNav,
    LayFooterContent,

    // views sidebars
    SbConfig,
    SbPeople,
    SbPurchase,
    SbInventory,
    SbManagement,
    SbProduction,
    SbDashNReports
}
