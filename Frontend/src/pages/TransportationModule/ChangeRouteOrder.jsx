import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const ChangeRouteOrder = () => {
  const navigate = useNavigate();

  const [dragEnable, setDragEnable] = useState(false);

  // yaha tum api se pickup points laa dena
  const [pickupPoints, setPickupPoints] = useState([
    {
      id: "1",
      name: "Sector 1",
      pickup: "09:40:00",
      drop: "17:40:00",
    },
    {
      id: "2",
      name: "Sector 2",
      pickup: "09:42:00",
      drop: "17:42:00",
    },
    {
      id: "3",
      name: "Sector 3",
      pickup: "09:43:00",
      drop: "17:46:00",
    },
    {
      id: "4",
      name: "Sector 4",
      pickup: "09:46:00",
      drop: "17:48:00",
    },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPickupPoints((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);

        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setDragEnable(false);
  };

  return (
    <div className="space-y-6">
      {/* header */}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-gray-300 font-semibold">
          Change order :{" "}
          <span className="text-2xl text-white fontit"> Bhuj - madhapar</span>
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-3 rounded-lg cursor-pointer"
        >
          Back
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold mb-6">Change Order</h2>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pickupPoints}
            strategy={verticalListSortingStrategy}
          >
            {pickupPoints.map((item, index) => (
              <PickupCard
                key={item.id}
                item={item}
                index={index}
                dragEnable={dragEnable}
                setDragEnable={setDragEnable}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

const PickupCard = ({ item, index, dragEnable, setDragEnable }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      disabled: !dragEnable,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => setDragEnable(true)}
      {...attributes}
      {...(dragEnable ? listeners : {})}
      className="
bg-gray-800 
border 
border-gray-700
rounded-xl
p-5
mb-4
cursor-pointer
flex
items-center
gap-5
"
    >
      <div
        className="
w-12
h-12
rounded-full
bg-cyan-700
flex
items-center
justify-center
text-white
font-bold
"
      >
        {index + 1}
      </div>

      <div>
        <h3 className="text-white font-semibold">{item.name}</h3>

        <p className="text-gray-400 mt-1">
          {item.pickup} - {item.drop}
        </p>
      </div>
    </div>
  );
};

export default ChangeRouteOrder;
