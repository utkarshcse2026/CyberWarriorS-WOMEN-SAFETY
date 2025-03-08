import KochiDataSet from '@/app/Data/kochi_road_features.json'
import React from 'react'

import IntegratedMapComponent from '@/components/ui/IntegratedMapComponent'

const Page = () => {
  return (
    <div>
      <IntegratedMapComponent crimeData={KochiDataSet}/>
    </div>
  )
}

export default Page