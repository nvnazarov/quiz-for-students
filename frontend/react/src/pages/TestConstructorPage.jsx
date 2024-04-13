import SideNavigationFragment from "../components/fragments/SideNavigationFragment";
import TestConstructor from "../components/TestConstructor";
import { useState } from "react";
import { Navigate } from "react-router-dom";


const TestConstructorPage = () => {
    const [categoryIndex, setCategoryIndex] = useState(0);

    const categories = [
        "Конструктор",
        "Выйти",
    ];

    const fragments = [
        <TestConstructor />
    ];

    const onCategorySelect = (index) => {
        setCategoryIndex(index);
    };

    if (categoryIndex === categories.length - 1) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="ProfileLayout">
            <div className="ProfileNavigation">
                <SideNavigationFragment
                    categories={ categories }
                    selectedIndex={ categoryIndex }
                    onSelect={ onCategorySelect } />
            </div>
            <div className="ProfileMain">
                { fragments[categoryIndex] }
            </div>
        </div>
    );
}


export default TestConstructorPage;