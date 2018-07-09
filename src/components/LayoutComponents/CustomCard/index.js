import React from 'react'
const CustomCard = (props) => {
    const { title, children } = props
    return(
        <div className="card">
            <div className="card-header">
              <div className="utils__title">{title}</div>
            </div>
            <div className="card-body">
              {children}
            </div>
          </div>
    )
}

export default CustomCard