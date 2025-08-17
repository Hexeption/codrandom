"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Shuffle,
  Zap,
  Target,
  Shield,
  Crosshair,
  Bomb,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

interface Loadout {
  primary: any;
  primaryAttachments: any[];
  secondary: any;
  secondaryAttachments: any[];
  melee: any;
  perks: Record<string, any>;
  wildcard: any;
  lethal: any;
  tactical: any;
}

export function LoadoutGenerator() {
  const [currentLoadout, setCurrentLoadout] = useState<Loadout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableGames = { BO6: true, MW3: false, MW2: false } as const;
  const [selectedGames, setSelectedGames] = useState({
    BO6: true,
    MW3: false,
    MW2: false,
  });

  const handleGameToggle = (game: keyof typeof selectedGames) => {
    if (!availableGames[game]) return;
    setSelectedGames((prev) => ({ ...prev, [game]: !prev[game] }));
  };

  const generateRandomLoadout = async () => {
    const enabledGames = Object.entries(selectedGames)
      .filter(([g, e]) => e && availableGames[g as keyof typeof selectedGames])
      .map(([g]) => g);

    if (enabledGames.length === 0) {
      toast.warning("Select at least one game", {
        description: "Currently only Black Ops 6 is available.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const chosen =
        enabledGames[Math.floor(Math.random() * enabledGames.length)] ??
        ("BO6" as const);
      const res = await fetch(
        `/api/loadout?game=${encodeURIComponent(chosen)}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as Loadout;
      setCurrentLoadout(data);
      toast.success("Loadout generated", {
        description: `${data.primary?.name ?? "Primary"} • ${data.secondary?.name ?? "Secondary"}`,
      });
    } catch (e: any) {
      const message = e?.message || "Unexpected error";
      toast.error("Failed to generate loadout", { description: message });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPerkColor = (slot: string) => {
    switch (slot) {
      case "Perk 1":
        return "bg-red-500/20 border-red-500 text-red-400";
      case "Perk 2":
        return "bg-blue-500/20 border-blue-500 text-blue-400";
      case "Perk 3":
        return "bg-green-500/20 border-green-500 text-green-400";
      default:
        return "bg-slate-700/50 border-slate-600 text-slate-300";
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-0 ring-1 ring-warzone/30 shadow-xl backdrop-blur-sm overflow-hidden py-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-warzone/20 to-warzone-2/20 border-b border-warzone/30 rounded-t-xl pt-4">
          <CardTitle className="text-warzone text-xl font-bold text-center">
            Select Your Arsenal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(selectedGames).map(([game, isSelected]) => (
              <button
                key={game}
                onClick={() =>
                  handleGameToggle(game as keyof typeof selectedGames)
                }
                disabled={!availableGames[game as keyof typeof selectedGames]}
                className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  !availableGames[game as keyof typeof availableGames]
                    ? "bg-gray-800/30 text-gray-600 border-2 border-gray-700/30 cursor-not-allowed opacity-60"
                    : isSelected
                      ? "bg-gradient-to-r from-warzone to-warzone-2 text-white shadow-lg border-2 border-warzone"
                      : "bg-gray-800/50 text-gray-400 border-2 border-gray-700/50 hover:border-gray-600/50 hover:text-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${isSelected ? "bg-white" : "bg-gray-600"}`}
                  />
                  <span>
                    {game === "BO6"
                      ? "Black Ops 6"
                      : game === "MW3"
                        ? "Modern Warfare 3"
                        : "Modern Warfare 2"}
                  </span>
                </div>
                {isSelected &&
                  availableGames[game as keyof typeof availableGames] && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-warzone/20 to-warzone-2/20 animate-pulse" />
                  )}
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Choose which Call of Duty titles to include weapons from
            </p>
            <div className="flex justify-center items-center mt-2 space-x-2">
              <div className="w-2 h-2 bg-warzone rounded-full animate-pulse" />
              <span className="text-xs text-warzone font-medium">
                {Object.values(selectedGames).filter(Boolean).length} game
                {Object.values(selectedGames).filter(Boolean).length !== 1
                  ? "s"
                  : ""}{" "}
                selected
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={generateRandomLoadout}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-warzone to-warzone-2 hover:from-warzone-2 hover:to-warzone text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="mr-2 h-5 w-5 animate-spin" /> Generating
              Loadout...
            </>
          ) : (
            <>
              <Shuffle className="mr-2 h-5 w-5" /> Generate Random Loadout
            </>
          )}
        </Button>
      </div>

      {currentLoadout && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-0 ring-1 ring-warzone/30 shadow-xl backdrop-blur-sm overflow-hidden py-0 gap-0">
            <CardHeader className="bg-gradient-to-r from-warzone/20 to-warzone-2/20 border-b border-warzone/30 rounded-t-xl pt-4">
              <CardTitle className="flex items-center text-warzone text-lg">
                <Target className="mr-2 h-6 w-6" /> Primary Weapon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentLoadout.primary.name}
                </h3>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-700/50 text-gray-200 border-gray-600"
                  >
                    {currentLoadout.primary.category}
                  </Badge>
                  <Badge className="bg-warzone/20 text-warzone border-warzone hover:bg-warzone/30">
                    {currentLoadout.primary.game}
                  </Badge>
                </div>
              </div>
              <Separator className="bg-gradient-to-r from-transparent via-warzone/50 to-transparent" />
              <div>
                <h4 className="font-semibold text-warzone mb-3 flex items-center">
                  <Wrench className="mr-2 h-4 w-4" /> Attachments (
                  {currentLoadout.primaryAttachments.length} / 8):
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {currentLoadout.primaryAttachments.map(
                    (attachment, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-3 rounded-lg border border-gray-700/50 hover:border-warzone/30 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-warzone capitalize font-medium">
                            {String(attachment.slot).replace("_", " ")}
                          </div>
                          <div className="text-white font-medium">
                            {attachment.name}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-0 ring-1 ring-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden py-0 gap-0">
            <CardHeader className="bg-gradient-to-r from-gray-600/30 to-gray-500/30 border-b border-gray-600/50 rounded-t-xl pt-4">
              <CardTitle className="flex items-center text-gray-200 text-lg">
                <Shield className="mr-2 h-6 w-6" /> Secondary Weapon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentLoadout.secondary.name}
                </h3>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-700/50 text-gray-200 border-gray-600"
                  >
                    {currentLoadout.secondary.category}
                  </Badge>
                  <Badge className="bg-gray-600/20 text-gray-400 border-gray-500 hover:bg-gray-600/30">
                    {currentLoadout.secondary.game}
                  </Badge>
                </div>
              </div>
              <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
              <div>
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center">
                  <Wrench className="mr-2 h-4 w-4" /> Attachments:
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {currentLoadout.secondaryAttachments.map(
                    (attachment, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-3 rounded-lg border border-gray-700/50 hover:border-gray-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-400 capitalize font-medium">
                            {String(attachment.slot).replace("_", " ")}
                          </div>
                          <div className="text-white font-medium">
                            {attachment.name}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-0 ring-1 ring-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden py-0 gap-0 lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-gray-600/30 to-gray-500/30 border-b border-gray-600/50 rounded-t-xl pt-4">
              <CardTitle className="text-gray-200 text-lg flex items-center">
                <Bomb className="mr-2 h-6 w-6" /> Equipment & Perks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-4 text-lg flex items-center">
                    <Crosshair className="mr-2 h-5 w-5" /> Equipment
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 p-4 rounded-lg">
                      <div className="text-sm text-orange-400 font-medium mb-1">
                        Melee
                      </div>
                      <div className="text-white font-semibold">
                        {currentLoadout.melee?.name ?? "—"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 p-4 rounded-lg">
                      <div className="text-sm text-red-400 font-medium mb-1">
                        Lethal
                      </div>
                      <div className="text-white font-semibold">
                        {currentLoadout.lethal?.name ?? "—"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 p-4 rounded-lg">
                      <div className="text-sm text-yellow-400 font-medium mb-1">
                        Tactical
                      </div>
                      <div className="text-white font-semibold">
                        {currentLoadout.tactical?.name ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-4 text-lg">
                    Perks
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(currentLoadout.perks).map(
                      ([slot, perk]) => (
                        <div
                          key={slot}
                          className={`p-4 rounded-lg border ${getPerkColor(slot)} transition-all duration-200 hover:scale-105`}
                        >
                          <div className="text-sm font-medium mb-1">{slot}</div>
                          <div className="text-white font-semibold">
                            {perk.name}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-4 text-lg">
                    Wildcard
                  </h4>
                  <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 p-6 rounded-lg text-center">
                    <div className="text-purple-400 text-sm font-medium mb-2">
                      Special Ability
                    </div>
                    <div className="text-white font-bold text-lg">
                      {currentLoadout.wildcard?.name ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!currentLoadout && !isGenerating && (
        <Card className="bg-gradient-to-br from-black/70 to-gray-900/70 border-0 ring-1 ring-gray-800/50 text-center py-16 shadow-2xl backdrop-blur-sm overflow-hidden">
          <CardContent>
            <div className="bg-warzone/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-12 w-12 text-warzone" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Drop?
            </h3>
            <p className="text-gray-400 text-lg">
              Click the button above to generate your perfect Warzone loadout
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
