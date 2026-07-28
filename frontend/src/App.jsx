import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import MealPlanView from './components/MealPlanView.jsx';
import RecipesView from './components/RecipesView.jsx';
import ShoppingListView from './components/ShoppingListView.jsx';
import IngredientsView from './components/IngredientsView.jsx';
import MealPlanModal from './components/MealPlanModal.jsx';
import RecipeDetailModal from './components/RecipeDetailModal.jsx';
import RecipeFormModal from './components/RecipeFormModal.jsx';
import ClonePlanModal from './components/ClonePlanModal.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('plan');
  
  // Data States
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [shoppingList, setShoppingList] = useState({ items: [], no_convertibles: [] });
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkedShoppingItems, setCheckedShoppingItems] = useState([]);
  
  // Modals States
  const [recipeModal, setRecipeModal] = useState({ isOpen: false, type: 'create', recipeData: null });
  const [recipeDetailModal, setRecipeDetailModal] = useState({ isOpen: false, recipe: null });
  const [mealPlanModal, setMealPlanModal] = useState({ isOpen: false });
  const [clonePlanModal, setClonePlanModal] = useState({ isOpen: false, planToClone: null });

  // Catalog Manager State
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [newIngredient, setNewIngredient] = useState({ nombre: '', unidad_base: 'g' });
  const [newConversion, setNewConversion] = useState({ unidad_origen: '', factor_a_base: '' });

  // Initial loading
  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
    fetchPlansList();
    loadActivePlan();
  }, []);

  // Sync shopping list checkbox state with localStorage when currentPlan changes
  useEffect(() => {
    if (currentPlan) {
      const savedChecked = localStorage.getItem(`mealcrafter_checked_${currentPlan.id}`);
      if (savedChecked) {
        setCheckedShoppingItems(JSON.parse(savedChecked));
      } else {
        setCheckedShoppingItems([]);
      }
      fetchShoppingList(currentPlan.id);
    }
  }, [currentPlan]);

  // Save checked items to localStorage
  const toggleShoppingItem = (key) => {
    let updated;
    if (checkedShoppingItems.includes(key)) {
      updated = checkedShoppingItems.filter(item => item !== key);
    } else {
      updated = [...checkedShoppingItems, key];
    }
    setCheckedShoppingItems(updated);
    if (currentPlan) {
      localStorage.setItem(`mealcrafter_checked_${currentPlan.id}`, JSON.stringify(updated));
    }
  };

  // API Call: Fetch recipes
  const fetchRecipes = async (query = '') => {
    try {
      const url = query ? `/api/recipes?q=${encodeURIComponent(query)}` : '/api/recipes';
      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  // API Call: Fetch ingredients
  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/ingredients');
      const data = await res.json();
      setIngredients(data);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
    }
  };

  // API Call: Fetch plans history list
  const fetchPlansList = async () => {
    try {
      const res = await fetch('/api/meal-plans');
      if (res.ok) {
        const data = await res.json();
        setAllPlans(data);
      }
    } catch (err) {
      console.error('Error fetching plans list:', err);
    }
  };

  // API Call: Load plan from localStorage
  const loadActivePlan = async () => {
    const savedId = localStorage.getItem('mealcrafter_current_plan_id');
    if (savedId) {
      try {
        const res = await fetch(`/api/meal-plans/${savedId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data);
          return;
        }
      } catch (err) {
        console.error('Error loading active plan:', err);
      }
      localStorage.removeItem('mealcrafter_current_plan_id');
    }
    
    // Fallback: load first plan in list
    try {
      const res = await fetch('/api/meal-plans');
      if (res.ok) {
        const list = await res.json();
        setAllPlans(list);
        if (list.length > 0) {
          handleSwitchPlan(list[0].id);
          return;
        }
      }
    } catch (err) {
      console.error('Error in active plan fallback:', err);
    }
    setCurrentPlan(null);
  };

  // API Call: Switch active plan
  const handleSwitchPlan = async (planId) => {
    try {
      const res = await fetch(`/api/meal-plans/${planId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data);
        localStorage.setItem('mealcrafter_current_plan_id', planId);
      }
    } catch (err) {
      console.error('Error switching plan:', err);
    }
  };

  // API Call: Fetch shopping list
  const fetchShoppingList = async (planId) => {
    if (!planId) return;
    try {
      const res = await fetch(`/api/meal-plans/${planId}/shopping-list`);
      if (res.ok) {
        const data = await res.json();
        setShoppingList(data);
      }
    } catch (err) {
      console.error('Error fetching shopping list:', err);
    }
  };

  // Action: Create Meal Plan
  const handleCreateMealPlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre');
    const fecha_inicio = formData.get('fecha_inicio');

    if (!fecha_inicio) return;

    try {
      setLoading(true);
      const res = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, fecha_inicio }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data);
        localStorage.setItem('mealcrafter_current_plan_id', data.id);
        fetchPlansList();
        setMealPlanModal({ isOpen: false });
        setActiveTab('plan');
      } else {
        const err = await res.json();
        alert(`Error al crear plan: ${err.error}`);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Action: Clone Plan
  const handleClonePlan = async (e) => {
    e.preventDefault();
    if (!clonePlanModal.planToClone) return;
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre');
    const fecha_inicio = formData.get('fecha_inicio');

    if (!fecha_inicio) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/meal-plans/${clonePlanModal.planToClone.id}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, fecha_inicio }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data);
        localStorage.setItem('mealcrafter_current_plan_id', data.id);
        fetchPlansList();
        setClonePlanModal({ isOpen: false, planToClone: null });
        setActiveTab('plan');
      } else {
        const err = await res.json();
        alert(`Error al duplicar plan: ${err.error}`);
      }
    } catch (error) {
      console.error('Error cloning plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Action: Delete Plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este plan de comidas? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        localStorage.removeItem('mealcrafter_current_plan_id');
        localStorage.removeItem(`mealcrafter_checked_${planId}`);
        const resList = await fetch('/api/meal-plans');
        if (resList.ok) {
          const list = await resList.json();
          setAllPlans(list);
          if (list.length > 0) {
            handleSwitchPlan(list[0].id);
          } else {
            setCurrentPlan(null);
          }
        }
      } else {
        alert('Error al eliminar el plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  // Action: Update single meal plan entry
  const handleUpdateEntry = async (entryId, recipeId, comensales) => {
    if (!currentPlan) return;
    try {
      // Optimistic Update
      const updatedEntries = currentPlan.entries.map(entry => {
        if (entry.id === entryId) {
          const associatedRecipe = recipes.find(r => r.id === parseInt(recipeId, 10));
          return {
            ...entry,
            recipe_id: recipeId ? parseInt(recipeId, 10) : null,
            recipe: associatedRecipe || null,
            comensales: recipeId ? (comensales || associatedRecipe?.porciones_base || 1) : 0,
          };
        }
        return entry;
      });
      setCurrentPlan({ ...currentPlan, entries: updatedEntries });

      // API call
      const res = await fetch(`/api/meal-plans/${currentPlan.id}/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe_id: recipeId ? parseInt(recipeId, 10) : null,
          comensales: recipeId ? (comensales || undefined) : null
        }),
      });

      if (res.ok) {
        const updatedEntry = await res.json();
        const syncedEntries = currentPlan.entries.map(e => e.id === entryId ? updatedEntry : e);
        setCurrentPlan({ ...currentPlan, entries: syncedEntries });
        fetchShoppingList(currentPlan.id);
      } else {
        const err = await res.json();
        alert(`Error al actualizar entrada: ${err.error}`);
        loadActivePlan(); // rollback
      }
    } catch (error) {
      console.error('Error updating slot:', error);
      loadActivePlan();
    }
  };

  // Action: Create or Edit Recipe
  const handleSaveRecipe = async (e, recipeData) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isEdit = recipeModal.type === 'edit';
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/recipes/${recipeModal.recipeData.id}` : '/api/recipes';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      if (res.ok) {
        setRecipeModal({ isOpen: false, type: 'create', recipeData: null });
        fetchRecipes(searchQuery);
        fetchIngredients();
        if (currentPlan) {
          loadActivePlan();
        }
      } else {
        const err = await res.json();
        alert(`Error al guardar receta: ${err.error}`);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Action: Create Ingredient
  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.nombre.trim()) return;
    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIngredient),
      });
      if (res.ok) {
        const data = await res.json();
        setNewIngredient({ nombre: '', unidad_base: 'g' });
        fetchIngredients();
        setSelectedIngredient(data);
      } else {
        const err = await res.json();
        alert(`Error al crear ingrediente: ${err.error}`);
      }
    } catch (error) {
      console.error('Error creating ingredient:', error);
    }
  };

  // Action: Add Conversion
  const handleAddConversion = async (e) => {
    e.preventDefault();
    if (!selectedIngredient || !newConversion.unidad_origen.trim() || !newConversion.factor_a_base) return;
    try {
      const res = await fetch(`/api/ingredients/${selectedIngredient.id}/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unidad_origen: newConversion.unidad_origen.trim(),
          factor_a_base: parseFloat(newConversion.factor_a_base)
        }),
      });
      if (res.ok) {
        setNewConversion({ unidad_origen: '', factor_a_base: '' });
        fetchIngredients();
        
        const ingRes = await fetch('/api/ingredients');
        const ingredientsList = await ingRes.json();
        const updated = ingredientsList.find(i => i.id === selectedIngredient.id);
        setSelectedIngredient(updated);
        if (currentPlan) {
          fetchShoppingList(currentPlan.id);
        }
      } else {
        const err = await res.json();
        alert(`Error al guardar conversión: ${err.error}`);
      }
    } catch (error) {
      console.error('Error adding conversion:', error);
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchRecipes(q);
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'plan' && (
          <MealPlanView
            currentPlan={currentPlan}
            recipes={recipes}
            handleUpdateEntry={handleUpdateEntry}
            setMealPlanModal={setMealPlanModal}
            allPlans={allPlans}
            handleSwitchPlan={handleSwitchPlan}
            setClonePlanModal={setClonePlanModal}
            handleDeletePlan={handleDeletePlan}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            recipes={recipes}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            setRecipeModal={setRecipeModal}
            setRecipeDetailModal={setRecipeDetailModal}
          />
        )}

        {activeTab === 'shopping-list' && (
          <ShoppingListView
            currentPlan={currentPlan}
            shoppingList={shoppingList}
            checkedShoppingItems={checkedShoppingItems}
            toggleShoppingItem={toggleShoppingItem}
            fetchShoppingList={fetchShoppingList}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ingredients' && (
          <IngredientsView
            ingredients={ingredients}
            selectedIngredient={selectedIngredient}
            setSelectedIngredient={setSelectedIngredient}
            newIngredient={newIngredient}
            setNewIngredient={setNewIngredient}
            handleCreateIngredient={handleCreateIngredient}
            newConversion={newConversion}
            setNewConversion={setNewConversion}
            handleAddConversion={handleAddConversion}
          />
        )}
      </main>

      <MealPlanModal
        isOpen={mealPlanModal.isOpen}
        onClose={() => setMealPlanModal({ isOpen: false })}
        onSubmit={handleCreateMealPlan}
        loading={loading}
      />

      <RecipeDetailModal
        isOpen={recipeDetailModal.isOpen}
        recipe={recipeDetailModal.recipe}
        onClose={() => setRecipeDetailModal({ isOpen: false, recipe: null })}
      />

      {recipeModal.isOpen && (
        <RecipeFormModal
          type={recipeModal.type}
          recipeData={recipeModal.recipeData}
          onClose={() => setRecipeModal({ isOpen: false, type: 'create', recipeData: null })}
          onSave={handleSaveRecipe}
          loading={loading}
        />
      )}

      <ClonePlanModal
        isOpen={clonePlanModal.isOpen}
        planName={clonePlanModal.planToClone ? clonePlanModal.planToClone.nombre || 'Plan Semanal' : ''}
        onClose={() => setClonePlanModal({ isOpen: false, planToClone: null })}
        onSubmit={handleClonePlan}
        loading={loading}
      />
    </>
  );
}

export default App;
