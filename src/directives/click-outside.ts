export default {

    beforeMount: function( el: any, binding: any ) {
        el.clickOutsideEvent = function( evt: any ) {
            if (!(el === evt.target || el.contains(evt.target))) {
                binding.value(evt, el)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
    },

    unmounted:   function( el: any ) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
}
