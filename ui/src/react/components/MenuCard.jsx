import React, { useState } from 'react'

const MenuCard = ({ item, onAdd }) => {
  const [shot, setShot] = useState(false)
  const [syrup, setSyrup] = useState(false)

  const handleAdd = () => {
    const options = { shot, syrup }
    onAdd(item, options)
  }

  return (
    <div className="menu-card">
      {item.image ? (
        <img className="menu-img" src={item.image} alt={item.name} />
      ) : (
        <div className="menu-image" aria-hidden />
      )}
      <h3 className="menu-title">{item.name}</h3>
      <div className="menu-price">{item.price.toLocaleString()}원</div>
      <p className="menu-desc">{item.desc}</p>

      <div className="options">
        <label>
          <input type="checkbox" checked={shot} onChange={e => setShot(e.target.checked)} /> 샷 추가 (+500원)
        </label>
        <label>
          <input type="checkbox" checked={syrup} onChange={e => setSyrup(e.target.checked)} /> 시럽 추가 (+0원)
        </label>
      </div>

      <button className="button add-button" onClick={handleAdd}>담기</button>
    </div>
  )
}

export default MenuCard
