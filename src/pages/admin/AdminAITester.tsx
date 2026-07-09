import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Terminal, Database, Send, Image as ImageIcon, MessageSquare, Code, Loader2, KeyRound, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { secureStorage } from '../../lib/secure-storage';

type Provider = "gemini" | "pollinations" | "huggingface" | "openrouter" | "puter" | "groq";
type ApiType = "text" | "image" | "audio" | "vision" | "video";

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview"
];

const OPENROUTER_MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free"
];

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant"
];

const HUGGINGFACE_MODELS = [
  "meta-llama/Llama-3.3-70B-Instruct",
  "Qwen/Qwen2.5-72B-Instruct",
  "microsoft/Phi-3-mini-4k-instruct",
  "HuggingFaceH4/zephyr-7b-beta",
  "baidu/Unlimited-OCR"
];

const HUGGINGFACE_IMAGE_MODELS = [
  "black-forest-labs/FLUX.1-schnell",
  "black-forest-labs/FLUX.1-dev",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "stabilityai/sdxl-turbo",
  "prompthero/openjourney"
];

const HUGGINGFACE_VIDEO_MODELS = [
  "ali-vilab/text-to-video-ms-1.7b",
  "ByteDance/AnimateDiff-Lightning",
  "cerspense/zeroscope_v2_576w"
];


const decryptKey = (encrypted: string): string => {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch (e) {
    return encrypted;
  }
};

const AdminAITester = () => {
  const [provider, setProvider] = useState<Provider>("pollinations");
  const [apiType, setApiType] = useState<ApiType>("text");
  
  const [targetModel, setTargetModel] = useState<string>("gemini-3.5-flash");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("Sektörel olarak yedek parça alanında bir slogan önerir misin?");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [limits, setLimits] = useState<{ remaining?: string | null, reset?: string | null, limit?: string | null } | null>(null);

  useEffect(() => {
    let key = "";
    if (provider === "gemini") {
      key = secureStorage.getItem("gemini_api_key") || "";
    } else if (provider === "openrouter") {
      key = secureStorage.getItem("or_api_key") || "";
    } else if (provider === "groq") {
      key = secureStorage.getItem("groq_api_key") || "";
    } else if (provider === "huggingface") {
      key = secureStorage.getItem("hf_api_key") || "";
    }
    
    if (key) {
      setApiKey(decryptKey(key));
    } else {
      setApiKey("");
    }

    if (provider === "gemini") setTargetModel(GEMINI_MODELS[0]);
    else if (provider === "openrouter") setTargetModel(OPENROUTER_MODELS[0]);
    else if (provider === "groq") setTargetModel(GROQ_MODELS[0]);
    else if (provider === "huggingface") {
      if (apiType === "image") setTargetModel(HUGGINGFACE_IMAGE_MODELS[0]);
      else if (apiType === "video") setTargetModel(HUGGINGFACE_VIDEO_MODELS[0]);
      else setTargetModel(HUGGINGFACE_MODELS[0]);
    } else setTargetModel("");
  }, [provider, apiType]);

  const testAPI = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLatency(null);
    setLimits(null);
    
    const startTime = performance.now();

    try {
      if (apiType === "text") {
        if (provider === "pollinations") {
          // Pollinations Free Text API
          const response = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
          if (!response.ok) throw new Error("API yanıt vermedi");
          const data = await response.text();
          setResult({ text: data });
        } else if (provider === "gemini") {
          // Gemini Text API
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          
          const endpointModel = targetModel || "gemini-3.5-flash";
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${endpointModel}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error.message || "Gemini Hatası");
          setResult({ text: data.candidates?.[0]?.content?.parts?.[0]?.text });
        } else if (provider === "openrouter") {
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          const endpointModel = targetModel || OPENROUTER_MODELS[0];
          const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://pasamotor.com.tr",
              "X-Title": "Pasa Motor Admin"
            },
            body: JSON.stringify({ 
              model: endpointModel,
              messages: [{ role: "user", content: prompt }],
              max_tokens: 1500
            })
          });
          
          // Limits check
          setLimits({
             remaining: response.headers.get("x-ratelimit-remaining"),
             reset: response.headers.get("x-ratelimit-reset"),
             limit: response.headers.get("x-ratelimit-limit")
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error.message || "OpenRouter Hatası");
          setResult({ text: data.choices?.[0]?.message?.content });
        } else if (provider === "puter") {
          // Dinamik Puter.js Yüklemesi
          if (typeof (window as any).puter === "undefined") {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://js.puter.com/v2/";
              script.onload = resolve;
              script.onerror = () => reject(new Error("Puter.js yüklenemedi."));
              document.head.appendChild(script);
            });
          }
          if (typeof (window as any).puter === "undefined") {
            throw new Error("Puter.js engellendi veya yüklenemedi.");
          }
          const response = await (window as any).puter.ai.chat(prompt);
          setResult({ text: response.message?.content || response.text || response });
        } else if (provider === "huggingface") {
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          const endpointModel = targetModel || HUGGINGFACE_MODELS[0];
          try {
            const response = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              body: JSON.stringify({ 
                model: endpointModel,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500
              })
            });
            
            if (!response.ok) {
                const errTxt = await response.text();
                throw new Error(`HF Error: ${response.status} ${errTxt}`);
            }
            const data = await response.json();
            if (data.error) throw new Error(data.error.message || data.error || "Hugging Face Hatası");
            setResult({ text: data.choices?.[0]?.message?.content });
          } catch(e: any) {
             if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                throw new Error("Failed to fetch: Hugging Face API'ye erişilemiyor. CORS nedeniyle tarayıcıdan doğrudan engellenmiş olabilir veya model kullanılamıyor.");
             }
             throw e;
          }
        } else if (provider === "groq") {
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          const endpointModel = targetModel || GROQ_MODELS[0];
          const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ 
              model: endpointModel,
              messages: [{ role: "user", content: prompt }] 
            })
          });
          
          // Limits check
          setLimits({
             remaining: response.headers.get("x-ratelimit-remaining-requests"),
             reset: response.headers.get("x-ratelimit-reset-requests"),
             limit: response.headers.get("x-ratelimit-limit-requests")
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error.message || "Groq Hatası");
          setResult({ text: data.choices?.[0]?.message?.content });
        }
      } else if (apiType === "image") {
        if (provider === "pollinations") {
          // Pollinations Image API
          const seed = Math.floor(Math.random() * 1000000);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`;
          
          // Try to load image
          setResult({ imageUrl });
        } else if (provider === "huggingface") {
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          try {
            const endpointModel = targetModel || HUGGINGFACE_IMAGE_MODELS[0];
            const response = await fetch(`https://api-inference.huggingface.co/models/${endpointModel}`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              body: JSON.stringify({ inputs: prompt })
            });
            if (!response.ok) {
              let errorMsg = "Görsel üretilemedi";
              try {
                 const data = await response.json();
                 errorMsg = data.error || errorMsg;
              } catch(e) {
                 const txt = await response.text().catch(() => "");
                 errorMsg = `HTTP ${response.status} ${txt}`;
              }
              throw new Error(errorMsg);
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setResult({ imageUrl });
          } catch(e: any) {
             if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                throw new Error("Failed to fetch: Hugging Face API'ye erişilemiyor. CORS nedeniyle tarayıcıdan doğrudan engellenmiş olabilir.");
             }
             throw e;
          }
        } else if (provider === "puter") {
          // Dinamik Puter.js Yüklemesi
          if (typeof (window as any).puter === "undefined") {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://js.puter.com/v2/";
              script.onload = resolve;
              script.onerror = () => reject(new Error("Puter.js yüklenemedi."));
              document.head.appendChild(script);
            });
          }
          if (typeof (window as any).puter === "undefined") {
            throw new Error("Puter.js engellendi veya yüklenemedi.");
          }
          const response = await (window as any).puter.ai.txt2img(prompt);
          setResult({ imageUrl: response.src || response.toString() });
        }
      } else if (apiType === "audio") {
        if (provider === "puter") {
          // Dinamik Puter.js Yüklemesi
          if (typeof (window as any).puter === "undefined") {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://js.puter.com/v2/";
              script.onload = resolve;
              script.onerror = () => reject(new Error("Puter.js yüklenemedi."));
              document.head.appendChild(script);
            });
          }
          if (typeof (window as any).puter === "undefined") {
            throw new Error("Puter.js engellendi veya yüklenemedi.");
          }
          const response = await (window as any).puter.ai.txt2speech(prompt);
          setResult({ audioUrl: response.src || response.toString() });
        }
      } else if (apiType === "video") {
        if (provider === "huggingface") {
          if (!apiKey) throw new Error("API Anahtarı gerekli");
          try {
            const endpointModel = targetModel || HUGGINGFACE_VIDEO_MODELS[0];
            const response = await fetch(`https://api-inference.huggingface.co/models/${endpointModel}`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              body: JSON.stringify({ inputs: prompt })
            });
            if (!response.ok) {
              let errorMsg = "Video üretilemedi";
              try {
                 const data = await response.json();
                 errorMsg = data.error || errorMsg;
              } catch(e) {
                 const txt = await response.text().catch(() => "");
                 errorMsg = `HTTP ${response.status} ${txt}`;
              }
              throw new Error(errorMsg);
            }
            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            setResult({ videoUrl });
          } catch(e: any) {
             if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                throw new Error("Failed to fetch: Hugging Face API'ye erişilemiyor. CORS nedeniyle tarayıcıdan doğrudan engellenmiş olabilir.");
             }
             throw e;
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Bilinmeyen bir hata oluştu");
    } finally {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Terminal className="w-6 h-6 text-primary" /> Yapay Zeka API Test Merkezi
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Farklı yapay zeka modellerinin (LLM ve Görsel Üretimi) API bağlantılarını test edip sistem gecikmelerini analiz edin.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border rounded-xl overflow-hidden glass-card">
            <div className="bg-muted p-4 border-b font-medium flex-items-center gap-2">
              <Database className="inline-block w-4 h-4 mr-2" />
              API Konfigürasyonu
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">API Türü</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setApiType("text")}
                    className={`flex-1 min-w-[100px] py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${apiType === "text" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
                  >
                    <MessageSquare className="w-4 h-4" /> Metin (LLM)
                  </button>
                  <button 
                    onClick={() => { setApiType("image"); setProvider("puter"); }}
                    className={`flex-1 min-w-[100px] py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${apiType === "image" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
                  >
                    <ImageIcon className="w-4 h-4" /> Görsel
                  </button>
                  <button 
                    onClick={() => { setApiType("audio"); setProvider("puter"); }}
                    className={`flex-1 min-w-[100px] py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${apiType === "audio" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
                  >
                    SES (TTS)
                  </button>
                  <button 
                    onClick={() => { setApiType("video"); setProvider("huggingface"); }}
                    className={`flex-1 min-w-[100px] py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${apiType === "video" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
                  >
                    VİDEO
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Sağlayıcı (Provider)</label>
                <select 
                  className="w-full bg-background border p-2 rounded-md text-sm"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as Provider)}
                >
                  {apiType === "text" && (
                     <>
                       <option value="pollinations">Pollinations.ai (Ücretsiz / Keysiz)</option>
                       <option value="puter">Puter.js (All-in-One / Ücretsiz)</option>
                       <option value="gemini">Google Gemini (API Key Gerekli)</option>
                       <option value="openrouter">OpenRouter (API Key Gerekli / Ücretsiz Modeller)</option>
                       <option value="groq">Groq (Maksimum Hız / Ücretsiz Katman)</option>
                       <option value="huggingface">Hugging Face (API Key Gerekli)</option>
                     </>
                  )}
                  {apiType === "image" && (
                     <>
                       <option value="pollinations">Pollinations.ai (Ücretsiz / Keysiz)</option>
                       <option value="puter">Puter.js (Ücretsiz AI)</option>
                       <option value="huggingface">Hugging Face (API Key Gerekli)</option>
                     </>
                  )}
                  {apiType === "audio" && (
                     <>
                       <option value="puter">Puter.js Ses (Ücretsiz)</option>
                     </>
                  )}
                  {apiType === "video" && (
                     <>
                       <option value="huggingface">Hugging Face (API Key Gerekli)</option>
                     </>
                  )}
                </select>
              </div>

              {(provider === "gemini" || provider === "openrouter" || provider === "groq" || provider === "huggingface") && apiType === "text" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Araç Model Seçimi</label>
                  <select 
                    className="w-full bg-background border p-2 rounded-md text-sm"
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                  >
                    {provider === "gemini" && GEMINI_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    {provider === "openrouter" && OPENROUTER_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    {provider === "groq" && GROQ_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    {provider === "huggingface" && HUGGINGFACE_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {provider === "huggingface" && apiType === "image" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Görsel Model Seçimi</label>
                  <select 
                    className="w-full bg-background border p-2 rounded-md text-sm"
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                  >
                    {HUGGINGFACE_IMAGE_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {provider === "huggingface" && apiType === "video" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Video Model Seçimi</label>
                  <select 
                    className="w-full bg-background border p-2 rounded-md text-sm"
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                  >
                    {HUGGINGFACE_VIDEO_MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {(provider !== "pollinations" && provider !== "puter") && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                    <KeyRound className="w-3 h-3" /> API Anahtarı
                  </label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-background border p-2 rounded-md text-sm"
                  />
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                    <p>Bu deneme için tarayıcıda geçici olarak kullanılır.</p>
                    {provider === "gemini" && <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>}
                    {provider === "openrouter" && <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>}
                    {provider === "groq" && <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>}
                    {provider === "huggingface" && <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 border rounded-xl overflow-hidden glass-card flex flex-col">
            <div className="bg-muted p-4 border-b font-medium flex items-center gap-2">
              <Code className="inline-block w-4 h-4 mr-2" />
              İstek ve Yanıt Testi
            </div>
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div>
                 <label className="text-xs font-medium text-muted-foreground mb-1 block">İstek (Prompt)</label>
                 <textarea 
                   rows={3}
                   className="w-full bg-background border rounded-md p-3 text-sm resize-none focus:ring-1 focus:ring-primary"
                   placeholder="Yapay zekaya sormak istediğiniz prompt..."
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
              </div>

              <div className="flex justify-end">
                 <button 
                   onClick={testAPI}
                   disabled={loading || !prompt}
                   className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   {loading ? "Test Ediliyor..." : "Testi Başlat"}
                 </button>
              </div>

              <div className="mt-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground block">Yanıt / Çıktı</label>
                  <div className="flex items-center gap-2">
                    {limits?.remaining && (
                      <span className="text-xs font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded flex items-center gap-1" title="Kalan İstek Hakkı">
                        Kalan: {limits.remaining}
                      </span>
                    )}
                    {limits?.reset && (
                      <span className="text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded flex items-center gap-1" title="Sıfırlanma Süresi (Reset)">
                        Sıfırlanma (ms): {limits.reset}
                      </span>
                    )}
                    {latency !== null && (
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {latency} ms
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="w-full flex-1 min-h-[250px] bg-black/5 dark:bg-black/20 border rounded-md p-4 relative overflow-auto">
                  {error && (
                     <div className="text-red-500 text-sm flex flex-col items-center justify-center p-8 text-center h-full">
                       <AlertCircle className="w-8 h-8 mb-2" />
                       <span className="font-semibold">Test Başarısız</span>
                       <span className="mt-1 opacity-80">
                         {typeof error === "object" && error !== null ? (
                           (error as any).message || (error as any).text || JSON.stringify(error)
                         ) : (
                           String(error)
                         )}
                       </span>
                     </div>
                  )}

                  {!error && !result && !loading && (
                     <div className="text-muted-foreground text-sm flex flex-col items-center justify-center p-8 text-center h-full opacity-60">
                       <Terminal className="w-8 h-8 mb-2" />
                       Testi başlatmak için bir konfigürasyon seçin ve metin girin.
                     </div>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-sm animate-pulse">API'den yanıt bekleniyor...</span>
                    </div>
                  )}

                  {result && apiType === "text" && (
                    <div className="text-sm text-foreground whitespace-pre-wrap font-mono">
                      {typeof result.text === "object" && result.text !== null ? (
                        result.text.text || result.text.content || JSON.stringify(result.text, null, 2)
                      ) : (
                        String(result.text || "")
                      )}
                    </div>
                  )}

                  {result && apiType === "image" && (
                    <div className="flex items-center justify-center h-full relative">
                       <img src={result.imageUrl || result} alt="AI Üretimi Görsel" className="max-w-full max-h-full object-contain rounded" loading="lazy" decoding="async" />
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                  )}

                  {result && apiType === "audio" && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                       <audio controls src={result.audioUrl} className="w-full max-w-md" />
                       <div className="text-green-500 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Ses başarıyla üretildi
                       </div>
                    </div>
                  )}
                  {result && apiType === "video" && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                       <video controls src={result.videoUrl} className="w-full max-w-md rounded-lg shadow-lg border" />
                       <div className="text-green-500 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Video başarıyla üretildi
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </AdminLayout>
  );
};

export default AdminAITester;
