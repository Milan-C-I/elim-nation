"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, X, Edit3, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updateUsers,
    deleteUser,
} from "@/backend/functions";
import { User as Player } from "@prisma/client";

export default function Home() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [newId, setNewId] = useState<number>();
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    // Fetch users on component mount
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const usersData = await getUsers();
                setPlayers(usersData);
            } catch (err) {
                setError("Failed to load players");
                console.error("Error fetching players:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // Toggle player elimination status
    const toggleEliminatedStatus = async (lid: number) => {
        try {
            // Find the player to toggle
            const playerToUpdate = players.find(
                (player) => player.playerId === lid
            ) as Player;
            if (!playerToUpdate) return;

            // Optimistically update UI
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.playerId === lid
                        ? { ...player, eliminated: !player.eliminated }
                        : player
                )
            );

            // Update in backend
            const { id, ...pTP } = playerToUpdate;
            await updateUser(id, {
                ...pTP,
                eliminated: !playerToUpdate.eliminated,
            });
        } catch (err) {
            console.error("Error updating player status:", err);
            // Revert optimistic update if failed
            setPlayers((prevPlayers) => [...prevPlayers]);
        }
    };

    // Handle adding a new player
    const addPlayer = async () => {
        if (newPlayerName.trim() === "") return;

        try {
            const newPlayer = {
                playerId:
                    newId || Math.max(...players.map((p) => p.playerId), 0) + 1,
                name: newPlayerName,
                eliminated: false,
                checked: false,
                blank: false,
            };

            // Create in backend
            const createdPlayer = await createUser(newPlayer);

            // Update UI with the returned player or our new player object
            setPlayers((prev) => [...prev, createdPlayer || newPlayer]);

            // Reset form
            setNewPlayerName("");
            setNewId(undefined);
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Error adding player:", err);
            setError("Failed to add player");
        }
    };

    // Handle editing an existing player
    const editPlayer = async () => {
        if (!editingPlayer || newPlayerName.trim() === "") return;

        try {
            const updatedPlayer = { ...editingPlayer, name: newPlayerName };

            // Optimistically update UI
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.playerId === editingPlayer.playerId
                        ? updatedPlayer
                        : player
                )
            );

            // Update in backend
            await updateUser(editingPlayer.id, {
                playerId: editingPlayer.playerId,
                name: newPlayerName,
                eliminated: editingPlayer.eliminated,
                checked: editingPlayer.checked,
                blank: editingPlayer.blank,
            });

            // Reset form
            setEditingPlayer(null);
            setNewPlayerName("");
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Error updating player:", err);
            setError("Failed to update player");

            // Revert optimistic update
            setPlayers((prev) => [...prev]);
        }
    };

    // Handle deleting a player
    const deletePlayer = async (id: number) => {
        try {
            // Optimistically update UI
            setPlayers((prevPlayers) =>
                prevPlayers.filter((player) => player.playerId !== id)
            );

            // Delete from backend
            await deleteUser(id);
        } catch (err) {
            console.error("Error deleting player:", err);
            setError("Failed to delete player");

            // Fetch fresh data if delete fails
            const usersData = await getUsers();
            setPlayers(
                usersData.map((user) => ({
                    id: user.id,
                    playerId: user.playerId,
                    name: user.name,
                    eliminated: user.eliminated || false,
                    checked: user.checked || false,
                    blank: user.blank || false,
                }))
            );
        }
    };

    // Update all players (for bulk operations)
    const handleBulkUpdate = async (updatedPlayers: Player[]) => {
        try {
            await updateUsers(
                updatedPlayers.map((e) => ({
                    playerId: e.playerId,
                    name: e.name,
                    eliminated: e.eliminated,
                    checked: e.checked,
                    blank: e.blank,
                }))
            );
            setPlayers(updatedPlayers);
        } catch (err) {
            console.error("Error performing bulk update:", err);
            setError("Failed to update players");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-2xl">Loading players...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Editing Mode - Player Elimination
                </h1>

                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4 flex justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {/* Players Grid */}
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {players.map((player) => (
                        <motion.div
                            key={player.playerId}
                            className={`relative aspect-square overflow-hidden cursor-pointer`}
                            onClick={() =>
                                toggleEliminatedStatus(player.playerId)
                            }
                        >
                            <div
                                className={`w-full h-full flex flex-col items-center justify-center rounded p-2 
                ${
                    player.eliminated
                        ? "border-4 border-red-600 bg-opacity-50"
                        : ""
                } bg-teal-800`}
                            >
                                <div className="relative w-full h-3/4 flex items-center justify-center bg-gray-700 rounded overflow-hidden">
                                    <User className="w-full h-full p-2 text-gray-300" />
                                    <div className="absolute top-0 left-0 text-xs bg-black bg-opacity-50 px-1 rounded-br">
                                        {player.playerId}
                                    </div>
                                    <button
                                        className="absolute bottom-1 right-1 bg-gray-800 p-1 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingPlayer(player);
                                            setNewPlayerName(player.name);
                                            setNewId(player.playerId);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Edit3 className="text-white w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-1 text-xs text-center truncate w-full">
                                    {player.name}
                                </div>
                                <button
                                    className="absolute top-1 right-1 bg-red-600 p-1 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePlayer(player.playerId);
                                    }}
                                >
                                    <Trash2 className="text-white w-4 h-4" />
                                </button>
                                {player.eliminated && (
                                    <motion.div
                                        initial={{ scale: 2, opacity: 0.7 }}
                                        animate={{ scale: 1, opacity: 0.8 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center bg-red-700 bg-opacity-60 rounded"
                                    >
                                        <X className="text-white w-3/4 h-3/4" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        className="bg-green-600 px-4 py-2 rounded"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="inline-block w-5 h-5 mr-2" /> Add
                        Player
                    </button>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogOverlay />
                    <DialogContent className="bg-gray-800 text-white">
                        <DialogTitle className="text-xl mb-4">
                            {editingPlayer ? "Edit Player" : "Add Player"}
                        </DialogTitle>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">
                                    Player ID
                                </label>
                                <input
                                    type="number"
                                    className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded w-full"
                                    placeholder="Enter ID...."
                                    value={newId || ""}
                                    onChange={(e) =>
                                        setNewId(
                                            parseInt(e.target.value) ||
                                                undefined
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">
                                    Player Name
                                </label>
                                <input
                                    type="text"
                                    className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded w-full"
                                    placeholder="Enter player name"
                                    value={newPlayerName}
                                    onChange={(e) =>
                                        setNewPlayerName(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-gray-600 px-4 py-2 rounded mr-2"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 px-4 py-2 rounded"
                                onClick={editingPlayer ? editPlayer : addPlayer}
                            >
                                {editingPlayer ? "Update" : "Add"} Player
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
