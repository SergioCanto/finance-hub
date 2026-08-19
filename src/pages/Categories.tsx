import { useEffect, useState } from "react";

import CategoryForm from "../components/categories/CategoryForm";

import {
    getCategories,
    createCategory,
    updateCategory,
    archiveCategory,
} from "../services/categories";

export default function Categories() {

    const [categories, setCategories] =
        useState<any[]>([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingCategory,
        setEditingCategory] =
        useState<any>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const data =
            await getCategories();

        setCategories(data || []);
    }

    async function handleSave(
        category: {
            name: string;
            type: string;
        }
    ) {

        if (editingCategory) {

            await updateCategory(
                editingCategory.id,
                category
            );

        } else {

            await createCategory(
                category
            );

        }

        setEditingCategory(null);

        setShowModal(false);

        loadCategories();
    }

    async function handleDelete(
        id: string
    ) {

        const confirmed =
            window.confirm(
                "¿Archivar categoría?"
            );

        if (!confirmed) return;

        await archiveCategory(id);

        loadCategories();
    }

    function handleEdit(
        id: string
    ) {

        const category =
            categories.find(
                (c) => c.id === id
            );

        setEditingCategory(category);

        setShowModal(true);
    }

    return (
        <div>

            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Categorías
                </h1>

                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setShowModal(true);
                    }}
                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    + Nueva Categoría
                </button>

            </div>

            {showModal && (

                <div className="
                fixed
                inset-0
                bg-black/70
                flex
                items-center
                justify-center
                ">

                    <div className="
                    bg-zinc-900
                    p-6
                    rounded-xl
                    w-[500px]
                    ">

                        <div className="
                        flex
                        justify-between
                        mb-4
                        ">

                            <h2 className="text-xl font-semibold">
                                {editingCategory
                                    ? "Editar Categoría"
                                    : "Nueva Categoría"}
                            </h2>

                            <button
                                onClick={() => {
                                    setEditingCategory(null);
                                    setShowModal(false);
                                }}
                            >
                                ✕
                            </button>

                        </div>

                        <CategoryForm
                            onSave={handleSave}
                            initialData={
                                editingCategory
                                    ? {
                                        name:
                                            editingCategory.name,
                                        type:
                                            editingCategory.type,
                                    }
                                    : undefined
                            }
                            isEditing={
                                !!editingCategory
                            }
                        />

                    </div>

                </div>

            )}

            <div className="space-y-3">

                {categories.map(
                    (category) => (

                        <div
                            key={category.id}
                            className="
                            bg-zinc-900
                            rounded-xl
                            p-4
                            flex
                            justify-between
                            items-center
                            "
                        >

                            <div>

                                <h3 className="font-semibold">
                                    {category.name}
                                </h3>

                                <p className="text-zinc-400 text-sm">
                                    {category.type ===
                                        "expense"
                                        ? "Gasto"
                                        : "Ingreso"}
                                </p>

                            </div>

                            <div className="flex gap-4">

                                <button
                                    onClick={() =>
                                        handleEdit(
                                            category.id
                                        )
                                    }
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            category.id
                                        )
                                    }
                                >
                                    🗑️
                                </button>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}