<template>
  <div id="topper-border-cont" class="mp-stylized main-panel">

    <!-- NAV BAR -->
    <LayMainTopNav></LayMainTopNav>
    <!--<notifications />-->

    <!--CONTENT-->
    <div class="content">
      <transition appear name="page-fade">
        <div class="col-12">
          <div class="row" style="justify-content: space-between">

            <!-- POS -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.pos)">
              <i class="hub-icon-pos tim-icons icon-cart" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.pos' ) }}</h5>
            </CmpCard>

            <!-- DASHBOARD & REPORTS -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.dashNReports)">
              <i class="hub-icon-dash tim-icons icon-chart-bar-32" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.dash' ) }}</h5>
            </CmpCard>

            <!-- DAILY MANAGEMENT -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.dops)">
              <i class="hub-icon-management tim-icons icon-spaceship" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.management' ) }}</h5>
            </CmpCard>

            <!-- INVENTORY -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.inventory)">
              <i class="hub-icon-inventory tim-icons icon-components" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.inventory' ) }}</h5>
            </CmpCard>

            <!-- BoM | MANUFACTURING | PRODUCTION -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.bom)">
              <i class="hub-icon-manufacturing tim-icons icon-molecule-40" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.manufacturing' ) }}</h5>
            </CmpCard>

            <!-- PURCHASE -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.purchase)">
              <i class="hub-icon-purchases tim-icons icon-basket-simple" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.purchases' ) }}</h5>
            </CmpCard>

            <!-- PEOPLE -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.staff)">
              <i class="hub-icon-people tim-icons icon-badge" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.people' ) }}</h5>
            </CmpCard>

            <!-- CONFIGURATIONS -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.configs)">
              <i class="hub-icon-configs tim-icons icon-settings" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.configs' ) }}</h5>
            </CmpCard>

            <!-- GALLERY -->
            <CmpCard class="text-center btn btn-default mr-2 ml-2 mb-3" style="width: 14rem;"
                     @click="goToModule(RoutePathNames.gallery)">
              <i class="hub-icon-gallery tim-icons icon-image-02" style="font-size: 6em"></i>
              <h5 class="card-title mt-3" style="font-size: 0.8em">{{ $t( 'hub.modules.gallery' ) }}</h5>
            </CmpCard>

          </div>
        </div>
      </transition>
    </div>

    <!-- FOOTER -->
    <LayFooterContent />
  </div>

</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'
    import { CmpCard } from '@/components'
    import LayMainTopNav from '@/layouts/LayMainTopNav.vue'
    import LayFooterContent from '@/layouts/LayFooterContent.vue'
    import { RoutePathNames } from '@/services/definitions/route-paths'


    export default defineComponent({
        name: 'ViewHub',
        components: {
            CmpCard,
            LayMainTopNav,
            LayFooterContent,
        },
        setup () {

            //region ======== DECLARATIONS & LOCAL STATE ============================================

            const router = useRouter()

            //endregion =============================================================================

            //region ======== HOOKS =================================================================
            //endregion =============================================================================

            //#region ======= FETCHING DATA & ACTIONS ===============================================
            //endregion =============================================================================

            //#region ======= COMPUTATIONS & GETTERS ================================================
            //endregion =============================================================================

            //region ======== NAVIGATION ============================================================


            const goToModule = ( moduleRouteName: string ) => {
                router.push({ name: moduleRouteName })
            }

            //endregion =============================================================================

            //region ======== HELPERS ===============================================================
            //endregion =============================================================================

            //region ======= EVENTS HANDLERS & WATCHERS =============================================
            //endregion =============================================================================

            return {
                goToModule,
                RoutePathNames
            }
        }
    })
</script>
