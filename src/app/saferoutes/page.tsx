import KochiDataSet from '@/app/Data/kochi_road_features.json'
import React from 'react'
import PredictionMaps from '@/components/PredictionMap'

const page = () => {
  return (
    <div>
        <PredictionMaps crimeData={KochiDataSet}/>
    </div>
  )
}

export default page
