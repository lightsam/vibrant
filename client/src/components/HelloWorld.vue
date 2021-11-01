<script>
/* eslint-disable no-undef */
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = 'mykey'

export default {

  data() {
    return {
      str: '',
      modal: false,
      filteredStates: [],
    }
  },

  async mounted() {
    this.filterStates();
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
    await loader.load()
    this.initMap()
  },

  methods: {
    filterStates() {
      fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `{ states(str: "${this.str}") {
            name
            lat
            lng
          }
        }`})
      })
      .then(res => res.json())
      .then(response => this.filteredStates = response.data.states)
      .catch(err => console.log(err.message))
    },

    initMap() {
      const mapContainer = this.$refs.mapDiv
      return new google.maps.Map(mapContainer, {
        center: { // us center
            lat: 37.090200,
            lng: -95.712900
        },
        zoom: 4,
      })
    },

    setState(state) {
      this.str = state.name;
      this.modal = false;
      let map = this.initMap()
      new google.maps.Marker({
        position: { lat: state.lat, lng: state.lng },
        map,
        title: "Hello World!",
      });
      // state boundary:
      // new google.maps.KmlLayer({
      //   url: state.kml_url,
      //   map: map
      // });
    },
  },

  watch: {
    str() {
      this.filterStates();
    }
  }
}
</script>

<template>
    <body>
        <div id="app" style="height:400px; width:100%">
            <div class="about flex flex-col items-center">
                <div class="absolute inset-0 z-0" @click="modal=false"></div>
                <input type="text" class="bg-gray-300 px-4 py-2 z-10" autocomplete="off" v-model="str" @focus="modal=true">
                <div v-if="filteredStates && modal" class="z-10">
                    <ul class="w-48 bg-gray-800 text-white">
                        <li v-for="filteredState in filteredStates" :key="filteredState.name"
                        class="py-2 border-b cursor-pointer" @click="setState(filteredState)">{{ filteredState.name }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div ref="mapDiv" class="z-10" style="height:400px; width:100%"></div>
    </body>
</template>
