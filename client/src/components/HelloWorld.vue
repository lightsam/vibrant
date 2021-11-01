<script>
/* eslint-disable no-undef */
import { ref, onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = 'mykey'

export default {
  setup() {
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY })
    const mapDiv = ref(null)
    onMounted(async () => {
      await loader.load()
      new google.maps.Map(mapDiv.value, {
        center: {
            lat: 7.119082288502541,
            lng: -73.120029012106
        },
        zoom: 11,
      })
    })
    return { mapDiv }
  },

  data() {
    return {
      str: '',
      modal: false,
      filteredStates: [],
    }
  },

  mounted() {
    this.filterStates();
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
          }
        }`})
      })
      .then(res => res.json())
      .then(response => this.filteredStates = response.data.states)
      .catch(err => console.log(err.message))
    },
    setState(state) {
      this.str = state.name;
      this.modal = false;
      let map = new google.maps.Map(document.getElementById('google-maps-container'), {
          center: {
              lat: 7.119082288502541,
              lng: -73.120029012106
          },
          zoom: 11,
      });
      new google.maps.KmlLayer({
        url: 'https://github.com/lightsam/files/blob/master/example.kml?raw=true',
        map: map
      });
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

        <div ref="mapDiv" id="google-maps-container" class="z-10" style="height:400px; width:100%"></div>
    </body>
</template>
