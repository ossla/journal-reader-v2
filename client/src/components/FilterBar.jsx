import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Context } from '..'


const FilterBar = observer(() => {

  const { manga } = useContext(Context)

  const activeStyle = {
    backgroundColor: "#eeee",
    color: "#222831"
  }

  return (
    <div className='filterBar'>
        <img src="icons/filter.png" alt="filters" className='filterIcon' />
        <div className='filterProperties'>
            <div className='filterProp'>
              <span>Страна: </span>
              { manga.countries.map(country =>

                <button
                  className="filterProperty"
                  style={country.id === manga.selectedCountry.id ? activeStyle : {}}
                  // toggle страну
                  onClick={() => manga.selectedCountry === country ? manga.setSelectedCountry({}) : manga.setSelectedCountry(country)}
                  key={country.id}
                >
                  {country.name}
                </button>
              )}
            </div>
            <div className='filterProp'>
              <span>Годы: </span>
              { manga.years.map(year =>

                <button
                  className="filterProperty"
                  style={year.id === manga.selectedYear.id ? activeStyle : {}}
                  // toggle год
                  onClick={() => manga.selectedYear === year ? manga.setSelectedYear({}) : manga.setSelectedYear(year)}
                  key={year.id}
                >
                  {year.name}
                </button>
              )}
            </div>
        </div>
    </div>
  )
})

export default FilterBar