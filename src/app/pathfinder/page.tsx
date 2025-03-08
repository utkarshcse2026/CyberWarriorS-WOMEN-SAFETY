import MapComponent from '@/components/MapComponent'
import KochiDataSet from '@/app/Data/kochi_road_features.json'
import React from 'react'

const page = () => {
  return (
    <div>
      <MapComponent crimeData={KochiDataSet}/>
    </div>
  )
}

export default page
