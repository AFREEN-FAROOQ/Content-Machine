import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore - html2pdf.js doesn't have types
import html2pdf from "html2pdf.js";
import { 
  Sparkles, 
  Calendar, 
  Video, 
  Type as TypeIcon, 
  TrendingUp, 
  Rocket, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Hash,
  Clock,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { generateContentSystem, ContentSystem } from "@/src/services/gemini";

export default function ContentMachine() {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<ContentSystem | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    niche: "",
    audience: "",
    goal: "followers",
    platform: "Instagram",
    tone: "educational"
  });

  const handleGenerate = async () => {
    if (!formData.niche) return;
    setLoading(true);
    try {
      const data = await generateContentSystem(formData);
      setResult(data);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      const element = printRef.current;
      const opt = {
        margin: 10,
        filename: `content-strategy-${formData.niche.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as const }
      };

      // Temporarily show the print ref for capturing
      element.style.display = 'block';
      await html2pdf().set(opt).from(element).save();
      element.style.display = 'none';
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ContentMachine<span className="text-orange-500">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Beta</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hidden Print View */}
        <div ref={printRef} style={{ display: 'none', width: '800px', padding: '40px', background: 'white' }}>
          <div style={{ marginBottom: '40px', borderBottom: '2px solid #f97316', paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a' }}>30-Day Content Strategy</h1>
            <p style={{ color: '#666' }}>Niche: {formData.niche} | Platform: {formData.platform} | Goal: {formData.goal}</p>
          </div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>30-Day Calendar</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f8f8' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Day</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Type</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Idea</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Hook</th>
                </tr>
              </thead>
              <tbody>
                {result?.calendar.map(item => (
                  <tr key={item.day}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.day}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.type}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.idea}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.hook}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div style={{ pageBreakBefore: 'always' }}></div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>Viral Hooks</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {result?.hooks.map((hook, i) => (
                <div key={i} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                  <strong>{i + 1}.</strong> {hook}
                </div>
              ))}
            </div>
          </section>

          <div style={{ pageBreakBefore: 'always' }}></div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>Video Scripts</h2>
            {result?.scripts.map((script, i) => (
              <div key={i} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Script #{i + 1}: {script.hook}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Scenes:</strong>
                  <ul style={{ margin: '5px 0' }}>
                    {script.scenes.map((s, si) => <li key={si}>{s}</li>)}
                  </ul>
                </div>
                <p><strong>Voiceover:</strong> {script.voiceover}</p>
                <p><strong>Visuals:</strong> {script.visuals}</p>
              </div>
            ))}
          </section>

          <div style={{ pageBreakBefore: 'always' }}></div>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#f97316' }}>Captions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {result?.captions.map((caption, i) => (
                <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
                  <p style={{ fontWeight: 'bold' }}>{caption.hook}</p>
                  <p style={{ fontSize: '14px', margin: '10px 0' }}>{caption.value}</p>
                  <p style={{ color: '#f97316', fontWeight: 'bold' }}>CTA: {caption.cta}</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>{caption.hashtags.map(h => `#${h} `)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                  Transform ONE idea into <br />
                  <span className="text-orange-500 italic">30 days of content.</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-lg mx-auto">
                  The ultimate AI engine for creators, agencies, and marketers to dominate social media with zero effort.
                </p>
              </div>

              <Card className="border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Niche</label>
                      <Input 
                        placeholder="e.g. Filmmaker, Fitness Coach..." 
                        value={formData.niche}
                        onChange={(e) => setFormData({...formData, niche: e.target.value})}
                        className="bg-gray-50 border-gray-200 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Target Audience (Optional)</label>
                      <Input 
                        placeholder="e.g. Aspiring creators, Busy moms..." 
                        value={formData.audience}
                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                        className="bg-gray-50 border-gray-200 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Goal</label>
                      <Select value={formData.goal} onValueChange={(v) => setFormData({...formData, goal: v})}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="leads">Leads</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="awareness">Awareness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Platform</label>
                      <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Tone</label>
                      <Select value={formData.tone} onValueChange={(v) => setFormData({...formData, tone: v})}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="entertaining">Entertaining</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                          <SelectItem value="bold">Bold & Direct</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !formData.niche}
                    className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Building your Content Machine...
                      </>
                    ) : (
                      <>
                        Generate 30-Day System
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-orange-500">30</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Days</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-orange-500">10</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Scripts</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-orange-500">Viral</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Hooks</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <Button variant="ghost" onClick={() => setResult(null)} className="pl-0 text-gray-500 hover:text-orange-500">
                    ← Back to Input
                  </Button>
                  <h2 className="text-4xl font-bold tracking-tight">Your 30-Day Strategy</h2>
                  <p className="text-gray-500">Optimized for {formData.platform} • {formData.tone} Tone • {formData.goal} Goal</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="border-gray-200"
                    onClick={handleExportPDF}
                    disabled={exporting}
                  >
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {exporting ? "Exporting..." : "Export PDF"}
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">Copy All</Button>
                </div>
              </div>

              <div ref={contentRef} className="space-y-12 bg-[#fafafa] p-4 rounded-xl">
                <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="bg-gray-100 p-1 h-12 mb-8">
                  <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-full px-6">
                    <Calendar className="w-4 h-4 mr-2" /> Calendar
                  </TabsTrigger>
                  <TabsTrigger value="hooks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-full px-6">
                    <Sparkles className="w-4 h-4 mr-2" /> Hooks
                  </TabsTrigger>
                  <TabsTrigger value="scripts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-full px-6">
                    <Video className="w-4 h-4 mr-2" /> Scripts
                  </TabsTrigger>
                  <TabsTrigger value="captions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-full px-6">
                    <TypeIcon className="w-4 h-4 mr-2" /> Captions
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:shadow-sm h-full px-6">
                    <TrendingUp className="w-4 h-4 mr-2" /> Trends
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle>30-Day Content Roadmap</CardTitle>
                      <CardDescription>A day-by-day breakdown of your content schedule.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="w-20">Day</TableHead>
                              <TableHead className="w-32">Type</TableHead>
                              <TableHead>Content Idea</TableHead>
                              <TableHead>Hook</TableHead>
                              <TableHead className="w-32">Goal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.calendar.map((item) => (
                              <TableRow key={item.day} className="hover:bg-orange-50/30 transition-colors">
                                <TableCell className="font-bold text-orange-600">Day {item.day}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                                    {item.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{item.idea}</TableCell>
                                <TableCell className="text-gray-600 italic">"{item.hook}"</TableCell>
                                <TableCell>
                                  <Badge className="bg-orange-100 text-orange-700 border-none capitalize">
                                    {item.goal}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hooks" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.hooks.map((hook, i) => (
                      <Card key={i} className="border-gray-200 hover:border-orange-200 transition-colors group">
                        <CardContent className="p-6 flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            {i + 1}
                          </div>
                          <p className="text-lg font-medium leading-relaxed">"{hook}"</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="scripts" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {result.scripts.map((script, i) => (
                      <Card key={i} className="border-gray-200 overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-orange-500">Script #{i + 1}</Badge>
                            <Button variant="ghost" size="sm" className="h-8">Copy Script</Button>
                          </div>
                          <CardTitle className="text-xl mt-4">"{script.hook}"</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Scene Breakdown</h4>
                            {script.scenes.map((scene, si) => (
                              <div key={si} className="flex gap-3 text-sm">
                                <span className="text-orange-500 font-bold">{si + 1}.</span>
                                <p className="text-gray-700">{scene}</p>
                              </div>
                            ))}
                          </div>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">On-Screen Text</h4>
                            <div className="flex flex-wrap gap-2">
                              {script.onScreenText.map((text, ti) => (
                                <Badge key={ti} variant="outline" className="bg-white border-gray-200 text-gray-600">
                                  {text}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">Voiceover</h4>
                            <p className="text-sm italic text-orange-900 leading-relaxed">"{script.voiceover}"</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Layout className="w-3 h-3" />
                            <span>Visuals: {script.visuals}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="captions" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.captions.map((caption, i) => (
                      <Card key={i} className="border-gray-200">
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-2">
                            <p className="font-bold text-lg">"{caption.hook}"</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{caption.value}</p>
                            <p className="font-bold text-orange-600">CTA: {caption.cta}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {caption.hashtags.map((tag, ti) => (
                              <span key={ti} className="text-xs text-gray-400">#{tag}</span>
                            ))}
                          </div>
                          <Button variant="secondary" className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600">Copy Caption</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {result.trends.map((trend, i) => (
                      <Card key={i} className="border-gray-200">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3 space-y-2">
                            <Badge className="bg-green-100 text-green-700 border-none mb-2">Trending Format</Badge>
                            <h3 className="text-xl font-bold">{trend.format}</h3>
                          </div>
                          <div className="md:w-1/3 space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Adaptation</h4>
                            <p className="text-sm text-gray-600">{trend.adaptation}</p>
                          </div>
                          <div className="md:w-1/3 space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">How to Execute</h4>
                            <p className="text-sm text-gray-600 font-medium">{trend.execution}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Bonus Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-orange-500" /> Content Series Ideas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.series.map((series, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold mb-4">
                          {i + 1}
                        </div>
                        <p className="font-bold leading-tight">{series}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="w-6 h-6 text-orange-500" /> Posting Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Best Time</div>
                      <div className="text-lg font-bold text-orange-900">{result.postingTips.time}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Frequency</div>
                      <div className="text-lg font-bold text-gray-900">{result.postingTips.frequency}</div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className="text-center pt-12">
                <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to Top
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">ContentMachineAI</span>
          </div>
          <p className="text-sm text-gray-400">Powered by Gemini 3.1 Flash • Built for high-performance creators</p>
        </div>
      </footer>
    </div>
  );
}
