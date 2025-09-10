"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Users, MapPin, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Guest {
  id: string
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

export default function WeddingSeatingApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [selectedTableGuests, setSelectedTableGuests] = useState<Guest[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  const [appSettings, setAppSettings] = useState<AppSettings>({
    title: "Find Your Seat",
    subtitle: "Welcome to our celebration. Please search for your name to find your table assignment.",
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
      const supabase = createClient()

      try {
        // Load guests from database
        const { data: guestsData, error: guestsError } = await supabase.from("wedding_guests").select("*").order("name")

        if (guestsError) {
          console.error("Error loading guests:", guestsError)
          // Fallback to sample data if no data in database
          const sampleGuests = [
            { id: "1", name: "John Smith", table_number: 1 },
            { id: "2", name: "Sarah Johnson", table_number: 1 },
            { id: "3", name: "Michael Brown", table_number: 1 },
            { id: "4", name: "Emily Davis", table_number: 2 },
            { id: "5", name: "David Wilson", table_number: 2 },
            { id: "6", name: "Lisa Anderson", table_number: 2 },
            { id: "7", name: "Robert Taylor", table_number: 3 },
            { id: "8", name: "Jennifer Martinez", table_number: 3 },
            { id: "9", name: "William Garcia", table_number: 3 },
            { id: "10", name: "Amanda Rodriguez", table_number: 4 },
            { id: "11", name: "Christopher Lee", table_number: 4 },
            { id: "12", name: "Michelle White", table_number: 4 },
          ]
          setGuests(sampleGuests)
        } else {
          // If no guests in database, use sample data
          if (!guestsData || guestsData.length === 0) {
            console.log("[Main Page] No guests in database, using sample data")
            const sampleGuests = [
              { id: "1", name: "John Smith", table_number: 1 },
              { id: "2", name: "Sarah Johnson", table_number: 1 },
              { id: "3", name: "Michael Brown", table_number: 1 },
              { id: "4", name: "Emily Davis", table_number: 2 },
              { id: "5", name: "David Wilson", table_number: 2 },
              { id: "6", name: "Lisa Anderson", table_number: 2 },
              { id: "7", name: "Robert Taylor", table_number: 3 },
              { id: "8", name: "Jennifer Martinez", table_number: 3 },
              { id: "9", name: "William Garcia", table_number: 3 },
              { id: "10", name: "Amanda Rodriguez", table_number: 4 },
              { id: "11", name: "Christopher Lee", table_number: 4 },
              { id: "12", name: "Michelle White", table_number: 4 },
            ]
            console.log("[Main Page] Setting sample guests:", sampleGuests)
            setGuests(sampleGuests)
          } else {
            console.log("[Main Page] Loading guests from database:", guestsData)
            setGuests(guestsData)
          }
        }

        // Load app settings from database
        const { data: settingsData, error: settingsError } = await supabase
          .from("app_settings")
          .select("*")
          .limit(1)
          .single()

        if (settingsError) {
          console.error("Error loading settings:", settingsError)
          // Keep default settings if no data found
        } else if (settingsData) {
          setAppSettings({
            title: settingsData.title || appSettings.title,
            subtitle: settingsData.subtitle || appSettings.subtitle,
            backgroundImage: settingsData.background_image,
            backgroundSize: settingsData.background_size || appSettings.backgroundSize,
            backgroundPosition: settingsData.background_position || appSettings.backgroundPosition,
            backgroundOpacity: (settingsData.background_opacity || 50) / 100,
            tableCardBackgroundImage: settingsData.table_card_background_image,
            tableCardBackgroundSize: settingsData.table_card_background_size || appSettings.tableCardBackgroundSize,
            tableCardBackgroundPosition:
              settingsData.table_card_background_position || appSettings.tableCardBackgroundPosition,
            tableCardBackgroundOpacity: (settingsData.table_card_background_opacity || 50) / 100,
            titleFont: settingsData.title_font || appSettings.titleFont,
            subtitleFont: settingsData.subtitle_font || appSettings.subtitleFont,
            titleBackgroundOpacity: (settingsData.title_background_opacity || 50) / 100,
            subtitleBackgroundOpacity: (settingsData.subtitle_background_opacity || 50) / 100,
            tableCardIconColor: settingsData.table_card_icon_color || appSettings.tableCardIconColor,
            tableCardHeaderText: settingsData.table_card_header_text || appSettings.tableCardHeaderText,
            tableCardSubtext: settingsData.table_card_subtext || appSettings.tableCardSubtext,
            tableCardTableNumberText: settingsData.table_card_table_prefix || appSettings.tableCardTableNumberText,
            tableCardCelebrationText:
              settingsData.table_card_celebration_message || appSettings.tableCardCelebrationText,
            tableCardTextColor: settingsData.table_card_header_color || appSettings.tableCardTextColor,
            tableCardAccentColor: appSettings.tableCardAccentColor,
            tableCardHeaderTextColor: settingsData.table_card_header_color || appSettings.tableCardHeaderTextColor,
            tableCardTableNumberColor:
              settingsData.table_card_table_number_color || appSettings.tableCardTableNumberColor,
            tableCardSubtextColor: settingsData.table_card_subtext_color || appSettings.tableCardSubtextColor,
            tableCardCelebrationTextColor:
              settingsData.table_card_celebration_text_color || appSettings.tableCardCelebrationTextColor,
            tableCardCelebrationBoxOpacity: (settingsData.table_card_celebration_box_opacity || 20) / 100,
            tableCardTableNumberBoxOpacity: (settingsData.table_card_table_number_box_opacity || 50) / 100,
          })
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return []
    return guests.filter((guest) => guest.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
  }, [searchTerm, guests])

  const handleGuestSelect = (guest: Guest) => {
    console.log("[Main Page] Guest selected:", guest)
    console.log("[Main Page] All guests:", guests)
    setSelectedGuest(guest)
    setSearchTerm("")

    // Load other guests at the same table
    const tableGuests = guests.filter((g) => g.table_number === guest.table_number && g.id !== guest.id)
    console.log("[Main Page] Table guests found:", tableGuests)
    setSelectedTableGuests(tableGuests)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative"
      style={
        appSettings.backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(248, 250, 252, ${1 - appSettings.backgroundOpacity}), rgba(248, 250, 252, ${1 - appSettings.backgroundOpacity})), url(${appSettings.backgroundImage})`,
              backgroundSize: appSettings.backgroundSize,
              backgroundPosition: appSettings.backgroundPosition,
              backgroundAttachment: "fixed",
            }
          : {}
      }
    >
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-sm sm:max-w-lg">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <h1
              className={`text-2xl sm:text-4xl font-bold text-foreground tracking-tight text-balance ${appSettings.titleFont} ${
                appSettings.titleBackgroundOpacity > 0
                  ? "px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg"
                  : ""
              }`}
              style={
                appSettings.titleBackgroundOpacity > 0
                  ? {
                      background: `rgba(255, 255, 255, ${appSettings.titleBackgroundOpacity})`,
                    }
                  : {}
              }
            >
              {appSettings.title}
            </h1>
          </div>
          <p
            className={`text-muted-foreground text-base sm:text-lg leading-relaxed text-balance max-w-xs sm:max-w-md mx-auto ${appSettings.subtitleFont} ${
              appSettings.subtitleBackgroundOpacity > 0
                ? "px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 shadow-md"
                : ""
            }`}
            style={
              appSettings.subtitleBackgroundOpacity > 0
                ? {
                    background: `rgba(255, 255, 255, ${appSettings.subtitleBackgroundOpacity})`,
                  }
                : {}
            }
          >
            {appSettings.subtitle}
          </p>
          <div className="mt-4 sm:mt-6">
            <Link
              href="/admin"
              className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors underline decoration-dotted"
            >
              Event Management
            </Link>
          </div>
        </div>

        <div className="relative mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Enter your full name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg bg-card border-2 border-border focus:border-accent transition-all duration-200 shadow-sm"
            />
          </div>

          {filteredGuests.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-10 border-2 border-accent/20 shadow-xl bg-card/95 backdrop-blur-sm">
              <CardContent className="p-0">
                {filteredGuests.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => handleGuestSelect(guest)}
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/50 transition-all duration-200 border-b border-border/50 last:border-b-0 focus:bg-muted/50 focus:outline-none group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="font-medium text-foreground text-sm sm:text-base truncate">{guest.name}</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm flex-shrink-0"
                      >
                        Table {guest.table_number}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {selectedGuest && (
          <Card
            className="border-2 border-accent/30 shadow-2xl bg-card/95 backdrop-blur-sm"
            style={
              appSettings.tableCardBackgroundImage
                ? {
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, ${1 - appSettings.tableCardBackgroundOpacity}), rgba(255, 255, 255, ${1 - appSettings.tableCardBackgroundOpacity})), url(${appSettings.tableCardBackgroundImage})`,
                    backgroundSize: appSettings.tableCardBackgroundSize,
                    backgroundPosition: appSettings.tableCardBackgroundPosition,
                  }
                : {}
            }
          >
            <CardContent className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <MapPin className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: appSettings.tableCardIconColor }} />
                  <h2
                    className="text-xl sm:text-3xl font-bold tracking-tight text-center"
                    style={{ color: appSettings.tableCardHeaderTextColor }}
                  >
                    {appSettings.tableCardHeaderText}
                  </h2>
                </div>
                <div
                  className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-lg sm:text-xl font-semibold ${
                    appSettings.tableCardTableNumberBoxOpacity === 0
                      ? ""
                      : "shadow-lg backdrop-blur-sm border border-white/20"
                  }`}
                  style={{
                    backgroundColor:
                      appSettings.tableCardTableNumberBoxOpacity === 0
                        ? "transparent"
                        : `rgba(255, 255, 255, ${appSettings.tableCardTableNumberBoxOpacity / 100})`,
                    color: appSettings.tableCardTableNumberColor,
                  }}
                >
                  {appSettings.tableCardTableNumberText} {selectedGuest.table_number}
                </div>
              </div>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3"
                  style={{ color: appSettings.tableCardSubtextColor }}
                >
                  <Users
                    className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                    style={{ color: appSettings.tableCardIconColor }}
                  />
                  <span className="text-sm sm:text-xl">{appSettings.tableCardSubtext}</span>
                </h3>
                <div className="grid gap-2 sm:gap-3">
                  {console.log("[Main Page] Rendering table card with selectedTableGuests:", selectedTableGuests)}
                  {selectedTableGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                    >
                      <div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: appSettings.tableCardIconColor }}
                      ></div>
                      <span
                        className="font-medium text-sm sm:text-base"
                        style={{ color: appSettings.tableCardTextColor }}
                      >
                        {guest.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg border ${
                  appSettings.tableCardCelebrationBoxOpacity > 0 ? "border-accent/20" : "border-transparent"
                }`}
                style={{
                  backgroundColor:
                    appSettings.tableCardCelebrationBoxOpacity > 0
                      ? `rgba(248, 250, 252, ${appSettings.tableCardCelebrationBoxOpacity})`
                      : "transparent",
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles
                    className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                    style={{ color: appSettings.tableCardIconColor }}
                  />
                  <p
                    className="text-center font-medium text-sm sm:text-base"
                    style={{ color: appSettings.tableCardCelebrationTextColor }}
                  >
                    {appSettings.tableCardCelebrationText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedGuest && (
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 sm:p-8 text-center">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4 sm:mb-6 opacity-60" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Find Your Table Assignment
              </h3>
              <div className="text-muted-foreground space-y-2 sm:space-y-3 leading-relaxed text-sm sm:text-base">
                <p>Begin typing your full name in the search field above</p>
                <p>Select your name from the results that appear</p>
                <p>View your table number and fellow guests</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
