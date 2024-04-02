const SideNavigationFragment = ({ categories, selectedIndex, onSelect }) => {
    const categoryMapper = (category, index) => {
        if (index == selectedIndex) {
            return <div className="SidebarOptionSelected" key={ index } onClick={ () => onSelect(index) }>{ category }</div>;
        } else {
            return <div className="SidebarOption" key={ index } onClick={ () => onSelect(index) }>{ category }</div>;
        }
    };
    
    const categoriesElements = categories.map(categoryMapper);

    return (
        <div>
            <div className="Vertical SidebarGap">
                { categoriesElements }
            </div>
        </div>
    );
};


export default SideNavigationFragment;