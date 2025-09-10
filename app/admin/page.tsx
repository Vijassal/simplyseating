"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  ArrowLeft,
  Save,
  Settings,
  X,
  Upload,
  FileText,
  Eye,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Guest {
  id: number
  name: string
  table_number: number
}

interface AppSettings {
  title: string
  subtitle: string
  backgroundImage: string | null
  backgroundSize: string
  backgroundPosition: string
  backgroundOpacity: number
  tableCardBackgroundImage: string | null
  tableCardBackgroundSize: string
  tableCardBackgroundPosition: string
  tableCardBackgroundOpacity: number
  titleFont: string
  subtitleFont: string
  titleBackgroundOpacity: number
  subtitleBackgroundOpacity: number
  tableCardIconColor: string
  tableCardHeaderText: string
  tableCardSubtext: string
  tableCardTableNumberText: string
  tableCardCelebrationText: string
  tableCardTextColor: string
  tableCardAccentColor: string
  tableCardHeaderTextColor: string
  tableCardTableNumberColor: string
  tableCardSubtextColor: string
  tableCardCelebrationTextColor: string
  tableCardCelebrationBoxOpacity: number
  tableCardTableNumberBoxOpacity: number
}

const convertToSnakeCase = (obj: AppSettings) => {
  return {
    title: obj.title,
    subtitle: obj.subtitle,
    background_image: obj.backgroundImage,
    background_size: obj.backgroundSize,
    background_position: obj.backgroundPosition,
    background_opacity: Math.round(obj.backgroundOpacity * 100), // Convert to integer
    table_card_background_image: obj.tableCardBackgroundImage,
    table_card_background_size: obj.tableCardBackgroundSize,
    table_card_background_position: obj.tableCardBackgroundPosition,
    table_card_background_opacity: Math.round(obj.tableCardBackgroundOpacity * 100), // Convert to integer
    title_font: obj.titleFont,
    subtitle_font: obj.subtitleFont,
    title_background_opacity: Math.round(obj.titleBackgroundOpacity * 100), // Convert to integer
    subtitle_background_opacity: Math.round(obj.subtitleBackgroundOpacity * 100), // Convert to integer
    table_card_icon_color: obj.tableCardIconColor,
    table_card_header_text: obj.tableCardHeaderText,
    table_card_subtext: obj.tableCardSubtext,
    table_card_table_prefix: obj.tableCardTableNumberText,
    table_card_celebration_message: obj.tableCardCelebrationText,
    table_card_header_color: obj.tableCardHeaderTextColor,
    table_card_table_number_color: obj.tableCardTableNumberColor,
    table_card_subtext_color: obj.tableCardSubtextColor,
    table_card_celebration_text_color: obj.tableCardCelebrationTextColor,
    table_card_celebration_box_opacity: Math.round(obj.tableCardCelebrationBoxOpacity * 100), // Convert to integer
    table_card_table_number_box_opacity: Math.round(obj.tableCardTableNumberBoxOpacity * 100), // Convert to integer
  }
}

const convertFromSnakeCase = (obj: any): AppSettings => {
  return {
    title: obj.title || "Find Your Seat Assignment",
    subtitle: obj.subtitle || "Begin typing your full name in the search field above",
    backgroundImage: obj.background_image || null,
    backgroundSize: obj.background_size || "cover",
    backgroundPosition: obj.background_position || "center",
    backgroundOpacity: (obj.background_opacity || 30) / 100, // Convert from integer to decimal
    tableCardBackgroundImage: obj.table_card_background_image || null,
    tableCardBackgroundSize: obj.table_card_background_size || "cover",
    tableCardBackgroundPosition: obj.table_card_background_position || "center",
    tableCardBackgroundOpacity: (obj.table_card_background_opacity || 20) / 100, // Convert from integer to decimal
    titleFont: obj.title_font || "font-serif",
    subtitleFont: obj.subtitle_font || "font-sans",
    titleBackgroundOpacity: (obj.title_background_opacity || 10) / 100, // Convert from integer to decimal
    subtitleBackgroundOpacity: (obj.subtitle_background_opacity || 10) / 100, // Convert from integer to decimal
    tableCardIconColor: obj.table_card_icon_color || "#64748b",
    tableCardHeaderText: obj.table_card_header_text || "Your Table Assignment",
    tableCardSubtext: obj.table_card_subtext || "Here are your fellow guests at this table:",
    tableCardTableNumberText: obj.table_card_table_prefix || "Table",
    tableCardCelebrationText: obj.table_card_celebration_message || "We look forward to celebrating with you",
    tableCardTextColor: obj.table_card_text_color || "#0f172a",
    tableCardAccentColor: obj.table_card_accent_color || "#3b82f6",
    tableCardHeaderTextColor: obj.table_card_header_color || "#0f172a",
    tableCardTableNumberColor: obj.table_card_table_number_color || "#3b82f6",
    tableCardSubtextColor: obj.table_card_subtext_color || "#64748b",
    tableCardCelebrationTextColor: obj.table_card_celebration_text_color || "#374151",
    tableCardCelebrationBoxOpacity: (obj.table_card_celebration_box_opacity || 10) / 100, // Convert from integer to decimal
    tableCardTableNumberBoxOpacity: (obj.table_card_table_number_box_opacity || 100) / 100, // Convert from integer to decimal
  }
}

export default function AdminPage() {
  const supabase = createClient()

  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuestName, setNewGuestName] = useState("")
  const [newGuestTable, setNewGuestTable] = useState("")
  const [multiEntryGuests, setMultiEntryGuests] = useState<Array<{ name: string; table_number: string }>>([
    { name: "", table_number: "" },
  ])
  const [showMultiEntry, setShowMultiEntry] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [csvData, setCsvData] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const [bulkTableNumber, setBulkTableNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "list">("table")
  const [loading, setLoading] = useState(true)

  const [appSettings, setAppSettings] = useState<AppSettings>({
    title: "Find Your Seat Assignment",
    subtitle: "Begin typing your full name in the search field above",
    backgroundImage: null,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundOpacity: 0.3,
    tableCardBackgroundImage: null,
    tableCardBackgroundSize: "cover",
    tableCardBackgroundPosition: "center",
    tableCardBackgroundOpacity: 0.2,
    titleFont: "font-serif",
    subtitleFont: "font-sans",
    titleBackgroundOpacity: 0.1,
    subtitleBackgroundOpacity: 0.1,
    tableCardIconColor: "#64748b",
    tableCardHeaderText: "Your Table Assignment",
    tableCardSubtext: "Here are your fellow guests at this table:",
    tableCardTableNumberText: "Table",
    tableCardCelebrationText: "We look forward to celebrating with you",
    tableCardTextColor: "#0f172a",
    tableCardAccentColor: "#3b82f6",
    tableCardHeaderTextColor: "#0f172a",
    tableCardTableNumberColor: "#3b82f6",
    tableCardSubtextColor: "#64748b",
    tableCardCelebrationTextColor: "#374151",
    tableCardCelebrationBoxOpacity: 0.1,
    tableCardTableNumberBoxOpacity: 100,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load app settings from database
        const { data: settingsData, error: settingsError } = await supabase
          .from("app_settings")
          .select("*")
          .limit(1)
          .single()

        if (settingsError) {
          console.error("Error loading settings:", settingsError)
          // Keep default settings when database is not available
        } else if (settingsData) {
          setAppSettings(convertFromSnakeCase(settingsData))
        }

        // Load guests from database
        const { data: guestsData, error: guestsError } = await supabase.from("wedding_guests").select("*")

        if (guestsError) {
          console.error("Error loading guests:", guestsError)
          // Fallback to sample data if no data in database
          const sampleGuests = [
            { id: 1, name: "John Smith", table_number: 1 },
            { id: 2, name: "Sarah Johnson", table_number: 1 },
            { id: 3, name: "Michael Brown", table_number: 1 },
            { id: 4, name: "Emily Davis", table_number: 2 },
            { id: 5, name: "David Wilson", table_number: 2 },
            { id: 6, name: "Lisa Anderson", table_number: 2 },
            { id: 7, name: "Robert Taylor", table_number: 3 },
            { id: 8, name: "Jennifer Martinez", table_number: 3 },
            { id: 9, name: "William Garcia", table_number: 3 },
            { id: 10, name: "Amanda Rodriguez", table_number: 4 },
            { id: 11, name: "Christopher Lee", table_number: 4 },
            { id: 12, name: "Michelle White", table_number: 4 },
          ]
          setGuests(sampleGuests)
        } else {
          setGuests(guestsData || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const saveSettings = async () => {
    try {
      console.log("[v0] Starting to save settings...")
      const snakeCaseSettings = convertToSnakeCase(appSettings)
      console.log("[v0] Converted settings:", snakeCaseSettings)

      // First, delete all existing settings
      await supabase.from("app_settings").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      // Then insert the new settings (Supabase will generate a UUID)
      const { error } = await supabase.from("app_settings").insert(snakeCaseSettings)

      if (error) {
        console.error("[v0] Error saving settings:", error)
        alert("Error saving settings. Please try again.")
      } else {
        console.log("[v0] Settings saved successfully!")
        alert("Settings saved successfully to Supabase!")
        setShowSettings(false)
      }
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      alert("Error saving settings. Please try again.")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAppSettings((prev) => ({
          ...prev,
          backgroundImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTableCardImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAppSettings((prev) => ({
          ...prev,
          tableCardBackgroundImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addGuest = async () => {
    if (newGuestName.trim() && newGuestTable) {
      try {
        const newGuest = {
          name: newGuestName.trim(),
          table_number: Number.parseInt(newGuestTable),
        }

        const { data, error } = await supabase.from("wedding_guests").insert([newGuest]).select().single()

        if (error) {
          console.error("Error adding guest:", error)
          alert("Error adding guest. Please try again.")
        } else if (data) {
          setGuests([...guests, data])
          setNewGuestName("")
          setNewGuestTable("")
        }
      } catch (error) {
        console.error("Error adding guest:", error)
        alert("Error adding guest. Please try again.")
      }
    }
  }

  const addMultipleGuests = async () => {
    const validEntries = multiEntryGuests.filter((entry) => entry.name.trim() && entry.table_number)

    if (validEntries.length === 0) return

    try {
      const newGuests = validEntries.map((entry) => ({
        name: entry.name.trim(),
        table_number: Number.parseInt(entry.table_number),
      }))

      const { data, error } = await supabase.from("wedding_guests").insert(newGuests).select()

      if (error) {
        console.error("Error adding guests:", error)
        alert("Error adding guests. Please try again.")
      } else if (data) {
        setGuests([...guests, ...data])
        setMultiEntryGuests([{ name: "", table_number: "" }])
      }
    } catch (error) {
      console.error("Error adding guests:", error)
      alert("Error adding guests. Please try again.")
    }
  }

  const updateMultiEntryGuest = (index: number, field: "name" | "table_number", value: string) => {
    const updated = [...multiEntryGuests]
    updated[index][field] = value
    setMultiEntryGuests(updated)
  }

  const addMultiEntryRow = () => {
    setMultiEntryGuests([...multiEntryGuests, { name: "", table_number: "" }])
  }

  const removeMultiEntryRow = (index: number) => {
    if (multiEntryGuests.length > 1) {
      setMultiEntryGuests(multiEntryGuests.filter((_, i) => i !== index))
    }
  }

  const updateGuest = async (id: number, name: string, tableNumber: number) => {
    try {
      const { error } = await supabase
        .from("wedding_guests")
        .update({ name: name.trim(), table_number: tableNumber })
        .eq("id", id)

      if (error) {
        console.error("Error updating guest:", error)
        alert("Error updating guest. Please try again.")
      } else {
        setGuests(
          guests.map((guest) => (guest.id === id ? { ...guest, name: name.trim(), table_number: tableNumber } : guest)),
        )
        setEditingGuest(null)
      }
    } catch (error) {
      console.error("Error updating guest:", error)
      alert("Error updating guest. Please try again.")
    }
  }

  const deleteGuest = async (id: number) => {
    try {
      const { error } = await supabase.from("wedding_guests").delete().eq("id", id)

      if (error) {
        console.error("Error deleting guest:", error)
        alert("Error deleting guest. Please try again.")
      } else {
        setGuests(guests.filter((guest) => guest.id !== id))
      }
    } catch (error) {
      console.error("Error deleting guest:", error)
      alert("Error deleting guest. Please try again.")
    }
  }

  const handleCsvImport = () => {
    if (!csvData.trim()) return

    const lines = csvData.trim().split("\n")
    const newGuests: Guest[] = []
    let maxId = Math.max(...guests.map((g) => g.id), 0)

    lines.forEach((line, index) => {
      const [firstName, lastName, tableNumber] = line.split(",").map((item) => item.trim())

      if (firstName && lastName && tableNumber) {
        const fullName = `${firstName} ${lastName}`
        const table = Number.parseInt(tableNumber)

        if (!isNaN(table)) {
          newGuests.push({
            id: ++maxId,
            name: fullName,
            table_number: table,
          })
        }
      }
    })

    if (newGuests.length > 0) {
      setGuests([...guests, ...newGuests])
      setCsvData("")
      setShowImport(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setCsvData(text)
      }
      reader.readAsText(file)
    }
  }

  const getGuestsByTable = () => {
    const tables: { [key: number]: Guest[] } = {}
    guests.forEach((guest) => {
      if (!tables[guest.table_number]) {
        tables[guest.table_number] = []
      }
      tables[guest.table_number].push(guest)
    })
    return tables
  }

  const tableGroups = getGuestsByTable()

  const fontOptions = [
    { value: "font-serif", label: "Elegant Serif" },
    { value: "font-sans", label: "Modern Sans" },
    { value: "font-mono", label: "Refined Mono" },
    { value: "font-['Playfair_Display']", label: "Playfair Display" },
    { value: "font-['Cormorant_Garamond']", label: "Cormorant Garamond" },
    { value: "font-['Crimson_Text']", label: "Crimson Text" },
    { value: "font-['Lora']", label: "Lora" },
    { value: "font-['Montserrat']", label: "Montserrat" },
  ]

  const backgroundSizeOptions = [
    { value: "cover", label: "Cover (Fill entire area)" },
    { value: "contain", label: "Contain (Fit entire image)" },
    { value: "auto", label: "Original Size" },
  ]

  const backgroundPositionOptions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "top left", label: "Top Left" },
    { value: "top right", label: "Top Right" },
    { value: "bottom left", label: "Bottom Left" },
    { value: "bottom right", label: "Bottom Right" },
  ]

  const sampleGuests = [
    { name: "John Smith", table: 1 },
    { name: "Sarah Johnson", table: 1 },
    { name: "Michael Brown", table: 1 },
    { name: "Emily Davis", table: 1 },
  ]

  const toggleGuestSelection = (guestId: number) => {
    setSelectedGuests((prev) => (prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]))
  }

  const selectAllInTable = (tableNumber: number) => {
    const tableGuests = guests.filter((g) => g.table_number === tableNumber).map((g) => g.id)
    setSelectedGuests((prev) => [...new Set([...prev, ...tableGuests])])
  }

  const bulkMoveGuests = async () => {
    if (selectedGuests.length === 0 || !bulkTableNumber) return

    try {
      const { error } = await supabase
        .from("wedding_guests")
        .update({ table_number: Number.parseInt(bulkTableNumber) })
        .in("id", selectedGuests)

      if (error) {
        console.error("Error moving guests:", error)
        alert("Error moving guests. Please try again.")
      } else {
        setGuests(
        guests.map((guest) =>
          selectedGuests.includes(guest.id) ? { ...guest, table_number: Number.parseInt(bulkTableNumber) } : guest,
        ),
        )
        setSelectedGuests([])
        setBulkTableNumber("")
      }
    } catch (error) {
      console.error("Error moving guests:", error)
      alert("Error moving guests. Please try again.")
    }
  }

  const bulkDeleteGuests = async () => {
    if (selectedGuests.length === 0) return

    try {
      const { error } = await supabase.from("wedding_guests").delete().in("id", selectedGuests)

      if (error) {
        console.error("Error deleting guests:", error)
        alert("Error deleting guests. Please try again.")
      } else {
        setGuests(guests.filter((guest) => !selectedGuests.includes(guest.id)))
        setSelectedGuests([])
      }
    } catch (error) {
      console.error("Error deleting guests:", error)
      alert("Error deleting guests. Please try again.")
    }
  }

  const filteredGuests = guests.filter((guest) => guest.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredTableGroups = () => {
    const tables: { [key: number]: Guest[] } = {}
    filteredGuests.forEach((guest) => {
      if (!tables[guest.table_number]) {
        tables[guest.table_number] = []
      }
      tables[guest.table_number].push(guest)
    })
    return tables
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to App</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">Wedding Seating Admin</h1>
              <p className="text-sm sm:text-base text-slate-600 hidden sm:block">
                Manage your guest list and customize your app
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="border-slate-300 hover:bg-slate-50 w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="sm:hidden">{showSettings ? "Hide Settings" : "Settings"}</span>
            <span className="hidden sm:inline">{showSettings ? "Hide Customization" : "Customize App"}</span>
          </Button>
        </div>

        {showSettings && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-4 sm:space-y-6">
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                      <span className="text-sm sm:text-base">App Customization</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Title & Subtitle Section */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Title & Subtitle
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs sm:text-sm font-medium text-slate-700">
                          Main Title
                        </Label>
                        <Input
                          id="title"
                          value={appSettings.title}
                          onChange={(e) => setAppSettings((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Find Your Seat"
                          className="border-slate-300 focus:border-slate-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-xs sm:text-sm font-medium text-slate-700">
                          Subtitle
                        </Label>
                        <textarea
                          id="subtitle"
                          value={appSettings.subtitle}
                          onChange={(e) => setAppSettings((prev) => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Welcome message..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-500 text-sm resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Title Font</Label>
                          <select
                            value={appSettings.titleFont}
                            onChange={(e) => setAppSettings((prev) => ({ ...prev, titleFont: e.target.value }))}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs sm:text-sm"
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value}>
                                {font.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Subtitle Font</Label>
                          <select
                            value={appSettings.subtitleFont}
                            onChange={(e) => setAppSettings((prev) => ({ ...prev, subtitleFont: e.target.value }))}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs sm:text-sm"
                          >
                            {fontOptions.map((font) => (
                              <option key={font.value} value={font.value}>
                                {font.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Title Background Opacity</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(appSettings.titleBackgroundOpacity * 100)}
                              onChange={(e) =>
                                setAppSettings((prev) => ({
                                  ...prev,
                                  titleBackgroundOpacity: Number.parseInt(e.target.value) / 100,
                                }))
                              }
                              className="w-12 sm:w-16 px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                            <span className="text-xs text-slate-500">%</span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Subtitle Background Opacity</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(appSettings.subtitleBackgroundOpacity * 100)}
                              onChange={(e) =>
                                setAppSettings((prev) => ({
                                  ...prev,
                                  subtitleBackgroundOpacity: Number.parseInt(e.target.value) / 100,
                                }))
                              }
                              className="w-12 sm:w-16 px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                            <span className="text-xs text-slate-500">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Images Section */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Background Images
                    </h3>

                    {/* Main Background */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-medium text-slate-700">Main Page Background</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="flex-1 border-slate-300 focus:border-slate-500 text-sm"
                        />
                        {appSettings.backgroundImage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppSettings((prev) => ({ ...prev, backgroundImage: null }))}
                            className="border-slate-300 hover:bg-slate-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {appSettings.backgroundImage && (
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            value={appSettings.backgroundSize}
                            onChange={(e) => setAppSettings((prev) => ({ ...prev, backgroundSize: e.target.value }))}
                            className="px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            {backgroundSizeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={appSettings.backgroundPosition}
                            onChange={(e) =>
                              setAppSettings((prev) => ({ ...prev, backgroundPosition: e.target.value }))
                            }
                            className="px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            {backgroundPositionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(appSettings.backgroundOpacity * 100)}
                              onChange={(e) =>
                                setAppSettings((prev) => ({
                                  ...prev,
                                  backgroundOpacity: Number.parseInt(e.target.value) / 100,
                                }))
                              }
                              className="w-12 text-xs border-slate-300"
                            />
                            <span className="text-xs text-slate-600">%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Table Card Background */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-medium text-slate-700">Table Card Background</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleTableCardImageUpload}
                          className="flex-1 border-slate-300 focus:border-slate-500 text-sm"
                        />
                        {appSettings.tableCardBackgroundImage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppSettings((prev) => ({ ...prev, tableCardBackgroundImage: null }))}
                            className="border-slate-300 hover:bg-slate-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {appSettings.tableCardBackgroundImage && (
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            value={appSettings.tableCardBackgroundSize}
                            onChange={(e) =>
                              setAppSettings((prev) => ({ ...prev, tableCardBackgroundSize: e.target.value }))
                            }
                            className="px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            {backgroundSizeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={appSettings.tableCardBackgroundPosition}
                            onChange={(e) =>
                              setAppSettings((prev) => ({ ...prev, tableCardBackgroundPosition: e.target.value }))
                            }
                            className="px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            {backgroundPositionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(appSettings.tableCardBackgroundOpacity * 100)}
                              onChange={(e) =>
                                setAppSettings((prev) => ({
                                  ...prev,
                                  tableCardBackgroundOpacity: Number.parseInt(e.target.value) / 100,
                                }))
                              }
                              className="w-12 text-xs border-slate-300"
                            />
                            <span className="text-xs text-slate-600">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Card Content Section */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Table Card Content
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">Header Text</Label>
                          <Input
                            value={appSettings.tableCardHeaderText}
                            onChange={(e) =>
                              setAppSettings((prev) => ({ ...prev, tableCardHeaderText: e.target.value }))
                            }
                            placeholder="Your Table Assignment"
                            className="border-slate-300 focus:border-slate-500 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600 mb-1 block">Table Number Prefix</Label>
                          <Input
                            value={appSettings.tableCardTableNumberText}
                            onChange={(e) =>
                              setAppSettings((prev) => ({ ...prev, tableCardTableNumberText: e.target.value }))
                            }
                            placeholder="Table"
                            className="border-slate-300 focus:border-slate-500 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">Subtext (before guest list)</Label>
                        <Textarea
                          value={appSettings.tableCardSubtext}
                          onChange={(e) => setAppSettings((prev) => ({ ...prev, tableCardSubtext: e.target.value }))}
                          placeholder="Here are your fellow guests at this table:"
                          className="border-slate-300 focus:border-slate-500 min-h-[50px] text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600 mb-1 block">Celebration Message</Label>
                        <Input
                          value={appSettings.tableCardCelebrationText}
                          onChange={(e) =>
                            setAppSettings((prev) => ({ ...prev, tableCardCelebrationText: e.target.value }))
                          }
                          placeholder="We look forward to celebrating with you"
                          className="border-slate-300 focus:border-slate-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Table Card Colors
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "tableCardIconColor", label: "Icons", placeholder: "#64748b" },
                        { key: "tableCardHeaderTextColor", label: "Header Text", placeholder: "#0f172a" },
                        { key: "tableCardTableNumberColor", label: "Table Number", placeholder: "#3b82f6" },
                        { key: "tableCardSubtextColor", label: "Subtext", placeholder: "#64748b" },
                        { key: "tableCardCelebrationTextColor", label: "Celebration Text", placeholder: "#374151" },
                      ].map((color) => (
                        <div key={color.key} className="space-y-1">
                          <Label className="text-xs text-slate-600">{color.label}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={appSettings[color.key as keyof AppSettings] as string}
                              onChange={(e) => setAppSettings((prev) => ({ ...prev, [color.key]: e.target.value }))}
                              className="w-8 h-8 border-slate-300 cursor-pointer"
                            />
                            <Input
                              value={appSettings[color.key as keyof AppSettings] as string}
                              onChange={(e) => setAppSettings((prev) => ({ ...prev, [color.key]: e.target.value }))}
                              placeholder={color.placeholder}
                              className="flex-1 border-slate-300 font-mono text-xs"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Celebration Box Opacity Control */}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-600">Celebration Box Opacity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={Math.round(appSettings.tableCardCelebrationBoxOpacity * 100)}
                            onChange={(e) =>
                              setAppSettings((prev) => ({
                                ...prev,
                                tableCardCelebrationBoxOpacity: Number.parseInt(e.target.value) / 100,
                              }))
                            }
                            className="w-20 border-slate-300 focus:border-slate-500 text-sm"
                          />
                          <span className="text-sm text-slate-600">%</span>
                        </div>
                      </div>

                      {/* Table Number Box Opacity Control */}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-600">Table Number Box Opacity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={appSettings.tableCardTableNumberBoxOpacity}
                            onChange={(e) =>
                              setAppSettings((prev) => ({
                                ...prev,
                                tableCardTableNumberBoxOpacity: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-20 border-slate-300 focus:border-slate-500 text-sm"
                          />
                          <span className="text-sm text-slate-600">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <Button onClick={saveSettings} className="bg-slate-900 hover:bg-slate-800 text-white">
                      Save All Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card className="border-slate-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                    <span className="text-sm sm:text-base">Live Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  {/* Title & Subtitle Preview */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                      Title & Subtitle Preview
                    </h4>
                    <div className="space-y-3 p-3 sm:p-4 bg-slate-100 rounded-lg">
                      {appSettings.titleBackgroundOpacity > 0 ? (
                        <div
                          className={`text-xl font-bold text-slate-900 ${appSettings.titleFont} p-3 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm`}
                          style={{ background: `rgba(255, 255, 255, ${appSettings.titleBackgroundOpacity})` }}
                        >
                          {appSettings.title || "Find Your Seat Assignment"}
                        </div>
                      ) : (
                        <div className={`text-xl font-bold text-slate-900 ${appSettings.titleFont}`}>
                          {appSettings.title || "Find Your Seat Assignment"}
                        </div>
                      )}

                      {appSettings.subtitleBackgroundOpacity > 0 ? (
                        <div
                          className={`text-slate-600 ${appSettings.subtitleFont} p-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm`}
                          style={{ background: `rgba(255, 255, 255, ${appSettings.subtitleBackgroundOpacity})` }}
                        >
                          {appSettings.subtitle || "Welcome to our celebration"}
                        </div>
                      ) : (
                        <div className={`text-slate-600 ${appSettings.subtitleFont}`}>
                          {appSettings.subtitle || "Welcome to our celebration"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Card Preview */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                      Table Card Preview
                    </h4>
                    <div
                      className="p-3 sm:p-6 rounded-xl border border-slate-200 shadow-lg bg-white/90 backdrop-blur-sm"
                      style={{
                        backgroundImage: appSettings.tableCardBackgroundImage
                          ? `linear-gradient(rgba(255, 255, 255, ${1 - appSettings.tableCardBackgroundOpacity}), rgba(255, 255, 255, ${1 - appSettings.tableCardBackgroundOpacity})), url(${appSettings.tableCardBackgroundImage})`
                          : "none",
                        backgroundSize: appSettings.tableCardBackgroundSize,
                        backgroundPosition: appSettings.tableCardBackgroundPosition,
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="text-center space-y-3 sm:space-y-4">
                        <h2 className="text-xl font-bold" style={{ color: appSettings.tableCardHeaderTextColor }}>
                          {appSettings.tableCardHeaderText || "Your Table Assignment"}
                        </h2>

                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: appSettings.tableCardIconColor }} />
                          <div
                            className={`inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xl font-semibold shadow-lg text-white ${
                              appSettings.tableCardTableNumberBoxOpacity === 0 ? "" : "bg-slate-600"
                            }`}
                            style={{
                              backgroundColor:
                                appSettings.tableCardTableNumberBoxOpacity === 0
                                  ? "transparent"
                                  : `rgba(100, 116, 139, ${appSettings.tableCardTableNumberBoxOpacity / 100})`,
                              boxShadow: appSettings.tableCardTableNumberBoxOpacity === 0 ? "none" : undefined,
                            }}
                          >
                            <span
                              className="text-lg font-semibold"
                              style={{ color: appSettings.tableCardTableNumberColor }}
                            >
                              {appSettings.tableCardTableNumberText || "Table"} 1
                            </span>
                          </div>
                        </div>

                        <p className="text-sm" style={{ color: appSettings.tableCardSubtextColor }}>
                          {appSettings.tableCardSubtext || "Here are your fellow guests at this table:"}
                        </p>

                        <div className="space-y-2">
                          {sampleGuests.map((guest, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                              <Sparkles className="h-3 w-3" style={{ color: appSettings.tableCardIconColor }} />
                              {guest.name}
                            </div>
                          ))}
                        </div>

                        <div
                          className="mt-4 sm:mt-6 p-3 rounded-lg border"
                          style={{
                            backgroundColor:
                              appSettings.tableCardCelebrationBoxOpacity === 0
                                ? "transparent"
                                : `rgba(248, 250, 252, ${appSettings.tableCardCelebrationBoxOpacity / 100})`,
                            borderColor:
                              appSettings.tableCardCelebrationBoxOpacity === 0
                                ? "transparent"
                                : `rgba(226, 232, 240, ${appSettings.tableCardCelebrationBoxOpacity / 100})`,
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4" style={{ color: appSettings.tableCardIconColor }} />
                            <span
                              className="text-sm font-medium"
                              style={{ color: appSettings.tableCardCelebrationTextColor }}
                            >
                              {appSettings.tableCardCelebrationText || "We look forward to celebrating with you"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Guest Management Section */}
        <Card className="mb-6 sm:mb-8 border-slate-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-4 sm:p-6">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-slate-900">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Guest Management</span>
                <span className="text-xs sm:text-sm text-slate-600">({guests.length} guests)</span>
              </div>
              {/* Guest Management Actions */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button
                  onClick={() => setShowImport(!showImport)}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 text-xs sm:text-sm"
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Import CSV
                </Button>
                <Button
                  onClick={() => setShowMultiEntry(!showMultiEntry)}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Multi Entry
                </Button>
                <Button
                  onClick={() => setViewMode(viewMode === "table" ? "list" : "table")}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View: {viewMode === "table" ? "By Table" : "All Guests"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {/* Search and Bulk Operations */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-slate-300 focus:border-slate-500 text-sm"
                  />
                </div>
                {selectedGuests.length > 0 && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-xs sm:text-sm text-slate-600">{selectedGuests.length} selected</span>
                    <Input
                      placeholder="Table #"
                      type="number"
                      value={bulkTableNumber}
                      onChange={(e) => setBulkTableNumber(e.target.value)}
                      className="w-16 h-8 border-slate-300 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={bulkMoveGuests}
                      disabled={!bulkTableNumber.trim()}
                      className="h-8 bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm"
                    >
                      Move
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={bulkDeleteGuests}
                      className="h-8 text-xs sm:text-sm"
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedGuests([])}
                      className="h-8 text-xs sm:text-sm"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {showImport && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    <Label className="text-sm font-medium text-slate-700">Import Guest List</Label>
                  </div>

                  <div className="text-xs text-slate-600 mb-3">
                    Format: First Name, Last Name, Table Number (one guest per line)
                    <br />
                    Example: John, Smith, 1
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <Label htmlFor="csvFile" className="text-xs text-slate-600 mb-1 block">
                        Upload CSV File
                      </Label>
                      <Input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="border-slate-300 focus:border-slate-500 text-sm"
                      />
                    </div>

                    <div className="text-xs text-slate-500 text-center">or</div>

                    <div>
                      <Label htmlFor="csvText" className="text-xs text-slate-600 mb-1 block">
                        Paste CSV Data
                      </Label>
                      <Textarea
                        id="csvText"
                        placeholder="John, Smith, 1&#10;Jane, Doe, 2&#10;Bob, Johnson, 1"
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        className="border-slate-300 focus:border-slate-500 min-h-[100px] font-mono text-sm"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowImport(false)
                          setCsvData("")
                        }}
                        className="border-slate-300 hover:bg-slate-50 text-xs sm:text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCsvImport}
                        disabled={!csvData.trim()}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm"
                      >
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Import Guests
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showMultiEntry && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                    <Label className="text-sm font-medium text-slate-700">Add Multiple Guests</Label>
                  </div>

                  <div className="space-y-2">
                    {multiEntryGuests.map((guest, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Guest name"
                          value={guest.name}
                          onChange={(e) => updateMultiEntryGuest(index, "name", e.target.value)}
                          className="flex-1 border-slate-300 focus:border-slate-500 text-sm"
                        />
                        <Input
                          placeholder="Table"
                          type="number"
                          value={guest.table_number}
                          onChange={(e) => updateMultiEntryGuest(index, "table_number", e.target.value)}
                          className="w-24 border-slate-300 focus:border-slate-500 text-sm"
                        />
                        {multiEntryGuests.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMultiEntryRow(index)}
                            className="border-slate-300 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-between">
                    <Button
                      variant="outline"
                      onClick={addMultiEntryRow}
                      className="border-slate-300 hover:bg-slate-50 bg-transparent text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Add Row
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowMultiEntry(false)
                          setMultiEntryGuests([{ name: "", table_number: "" }])
                        }}
                        className="border-slate-300 hover:bg-slate-50 text-xs sm:text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={addMultipleGuests}
                        disabled={!multiEntryGuests.some((g) => g.name.trim() && g.table_number.trim())}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Add All Guests
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Add Guest */}
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Input
                placeholder="Guest name"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="flex-1 border-slate-300 focus:border-slate-500 text-sm"
              />
              <Input
                placeholder="Table number"
                type="number"
                value={newGuestTable}
                onChange={(e) => setNewGuestTable(e.target.value)}
                className="w-24 border-slate-300 focus:border-slate-500 text-sm"
              />
              <Button
                onClick={addGuest}
                disabled={!newGuestName.trim() || !newGuestTable.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Guest Display */}
            {viewMode === "table" ? (
              // Table View
              <div className="space-y-3 sm:space-y-4">
                {Object.keys(filteredTableGroups())
                  .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
                  .map((tableNumber) => {
                    const tableGuests = filteredTableGroups()[Number.parseInt(tableNumber)]
                    const allSelected = tableGuests && tableGuests.length > 0 ? tableGuests.every((g) => selectedGuests.includes(g.id)) : false

                    // Only render tables that have guests
                    if (!tableGuests || tableGuests.length === 0) {
                      return null
                    }

                    return (
                      <div key={tableNumber} className="border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => selectAllInTable(Number.parseInt(tableNumber))}
                              className="rounded border-slate-300"
                            />
                            <h3 className="font-semibold text-slate-900">
                              Table {tableNumber} ({tableGuests.length} guests)
                            </h3>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2">
                          {tableGuests.map((guest) => (
                            <div
                              key={guest.id}
                              className="flex items-center justify-between p-2 hover:bg-slate-50 rounded"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedGuests.includes(guest.id)}
                                  onChange={() => toggleGuestSelection(guest.id)}
                                  className="rounded border-slate-300"
                                />
                                {editingGuest?.id === guest.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={editingGuest.name}
                                      onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                                      className="w-48 h-8 border-slate-300 text-sm"
                                    />
                                    <Input
                                      type="number"
                                      value={editingGuest.table_number}
                                      onChange={(e) =>
                                        setEditingGuest({ ...editingGuest, table_number: Number.parseInt(e.target.value) })
                                      }
                                      className="w-16 h-8 border-slate-300 text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => updateGuest(editingGuest.id, editingGuest.name, editingGuest.table_number)}
                                      className="h-8 text-xs sm:text-sm"
                                    >
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingGuest(null)}
                                      className="h-8 text-xs sm:text-sm"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="font-medium text-slate-900">{guest.name}</span>
                                )}
                              </div>
                              {editingGuest?.id !== guest.id && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingGuest(guest)}
                                    className="h-8 w-8 p-0 text-xs sm:text-sm"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteGuest(guest.id)}
                                    className="h-8 w-8 p-0 text-xs sm:text-sm"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              // List View
              <div className="space-y-2">
                {filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedGuests.includes(guest.id)}
                        onChange={() => toggleGuestSelection(guest.id)}
                        className="rounded border-slate-300"
                      />
                      {editingGuest?.id === guest.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingGuest.name}
                            onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                            className="w-48 h-8 border-slate-300 text-sm"
                          />
                          <Input
                            type="number"
                            value={editingGuest.table_number}
                            onChange={(e) =>
                              setEditingGuest({ ...editingGuest, table_number: Number.parseInt(e.target.value) })
                            }
                            className="w-16 h-8 border-slate-300 text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateGuest(editingGuest.id, editingGuest.name, editingGuest.table_number)}
                            className="h-8 text-xs sm:text-sm"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingGuest(null)}
                            className="h-8 text-xs sm:text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-slate-900 w-48">{guest.name}</span>
                          <span className="text-slate-600 w-16">Table {guest.table_number}</span>
                        </>
                      )}
                    </div>
                    {editingGuest?.id !== guest.id && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingGuest(guest)}
                          className="h-8 w-8 p-0 text-xs sm:text-sm"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteGuest(guest.id)}
                          className="h-8 w-8 p-0 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {guests.length === 0 && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No guests added yet</h3>
              <p className="text-slate-600">Start by adding your first guest above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
