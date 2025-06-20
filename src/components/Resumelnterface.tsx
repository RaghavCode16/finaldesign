import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  FileText,
  Briefcase,
  Shield,
  CheckCircle,
  Users,
  Award,
  Star,
  TrendingUp,
  Zap,
  Clock,
  Target,
  MapPin,
  DollarSign,
  Building,
  ExternalLink,
  Heart,
  Filter,
  Search,
} from "lucide-react";
import {
  uploadResumeApi,
  analyzeResumeApi,
  ResumeData,
} from "@/services/mockResumeApi";
import { fetchJobsApi, Job } from "@/services/mockJobsApi";

export default function ResumeInterface() {
  const [consent, setConsent] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsentChange = (checked: boolean | "indeterminate") => {
    setConsent(checked === true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeData(null);

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await uploadResumeApi(file);
      clearInterval(interval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: result.message,
        });

        setActiveTab("parser");
        // Auto-switch to parser tab after successful upload
        await handleAnalyzeResume();
      }
    } catch (error) {
      clearInterval(interval);
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeResumeApi();
      setResumeData(data);
      toast({
        title: "Analysis Complete",
        description: "Resume has been successfully analyzed",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSecureUpload = () => {
    const fileInput = document.getElementById("resume") as HTMLInputElement;
    fileInput?.click();
  };

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );

    toast({
      title: savedJobs.includes(jobId) ? "Job Removed" : "Job Saved",
      description: savedJobs.includes(jobId)
        ? "Removed from saved jobs"
        : "Added to saved jobs",
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Good Match";
    if (score >= 70) return "Fair Match";
    return "Basic Match";
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.trim().toLowerCase();
    const loc = locationFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q);

    const matchesLocation = !loc || job.location.toLowerCase().includes(loc);

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header with Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-pulse delay-200"></div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4">
            AI-Powered Resume Matcher
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your career journey with our intelligent matching system
            that connects your unique skills with perfect opportunities in under
            60 seconds
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-blue-700">
                Bank-level Security
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-green-700">
                50,000+ Happy Users
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-full border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-purple-700">
                AI Technology Leader
              </span>
            </div>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-blue-600 mb-2">
              <span className={activeTab === "landing" ? "font-semibold" : ""}>
                Upload
              </span>
              <span className={activeTab === "parser" ? "font-semibold" : ""}>
                Analyze
              </span>
              <span className={activeTab === "matching" ? "font-semibold" : ""}>
                Match
              </span>
            </div>
            <Progress
              value={
                activeTab === "landing" ? 33 : activeTab === "parser" ? 66 : 100
              }
              className="h-2 bg-blue-100"
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-lg">
            <TabsTrigger
              value="landing"
              className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 relative overflow-hidden"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </TabsTrigger>
            <TabsTrigger
              value="parser"
              className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Resume Analysis
            </TabsTrigger>
            <TabsTrigger
              value="matching"
              className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job Matching
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Enhanced Landing Page */}
          <TabsContent value="landing" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Upload Card */}
              <Card className="lg:col-span-2 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-white via-blue-50/30 to-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Upload Your Resume
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    Support for PDF, DOC, and DOCX files up to 10MB
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="resume"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      Choose your resume file
                    </Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="cursor-pointer border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 transition-all duration-300 h-12"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-blue-600 text-center">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleSecureUpload}
                    disabled={isUploading}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    {isUploading ? "Uploading..." : "Upload Resume Securely"}
                  </Button>

                  <div className="flex items-center gap-3 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>
                      Your data is encrypted end-to-end and never shared without
                      your explicit consent
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Features Card */}
              <Card className="border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    Why Choose Us?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Lightning-Fast AI
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced algorithms extract and analyze your skills in
                        seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">
                        Perfect Job Matching
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Find opportunities that perfectly align with your unique
                        profile
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group hover:bg-blue-50 p-3 rounded-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">
                        Privacy Guaranteed
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Bank-level encryption keeps your data completely secure
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          98%
                        </div>
                        <div className="text-xs text-blue-700">
                          Match Accuracy
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          60s
                        </div>
                        <div className="text-xs text-green-700">
                          Average Time
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof Section */}
            <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  Trusted by Professionals Worldwide
                </h3>
                <p className="text-muted-foreground">
                  Join thousands who've found their dream jobs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-muted-foreground">
                    Resumes Analyzed
                  </div>
                </div>
                <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-all duration-300">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-600">15K+</div>
                  <div className="text-sm text-muted-foreground">
                    Jobs Matched
                  </div>
                </div>
                <div className="text-center p-4 hover:bg-purple-50 rounded-lg transition-all duration-300">
                  <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    Support Available
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Enhanced Resume Parser */}
          <TabsContent value="parser" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Resume Preview */}
              <Card className="h-fit border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Resume Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="
                    h-[500px] 
                    border-2 border-dashed border-blue-200 
                    rounded-xl bg-gradient-to-br from-blue-50/20 to-blue-100/20 
                    flex flex-col items-stretch justify-start p-4 overflow-y-auto
                    hover:border-blue-300 transition-all duration-300"
                  >
                    {uploadedFile ? (
                      <div className="text-center">
                        {isAnalyzing ? (
                          <div className="animate-pulse">
                            <FileText className="w-20 h-20 text-blue-400 mb-6 mx-auto animate-bounce" />
                            <p className="text-lg text-blue-600 font-medium">
                              Analyzing resume...
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Our AI is extracting key information
                            </p>
                          </div>
                        ) : (
                          <div>
                            <FileText className="w-20 h-20 text-green-500 mb-6 mx-auto" />
                            <p className="text-lg text-green-600 font-medium mb-2">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Resume uploaded successfully
                            </p>
                            {uploadedFile.type === "application/pdf" ? (
                              <div className="w-full h-64 overflow-auto rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                                <iframe
                                  src={URL.createObjectURL(uploadedFile)}
                                  title="Resume Preview"
                                  className="w-full h-full rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="text-sm text-blue-500 font-medium italic">
                                Preview not supported for this file type.
                                <br />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="animate-pulse text-center">
                        <FileText className="w-20 h-20 text-blue-400 mb-6 mx-auto" />
                        <p className="text-muted-foreground text-lg mb-2">
                          Your resume will appear here once uploaded
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          PDF, DOC, or DOCX format supported
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Parsed Resume Details */}
              <Card className="h-fit border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    Extracted Information
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    AI-analyzed data from your resume with 98% accuracy
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {resumeData ? (
                    <>
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Personal Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                            <span className="font-medium text-blue-900">
                              Name
                            </span>
                            <span className="text-muted-foreground">
                              {resumeData.name}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                            <span className="font-medium text-blue-900">
                              Email
                            </span>
                            <span className="text-muted-foreground">
                              {resumeData.email}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                            <span className="font-medium text-blue-900">
                              Phone
                            </span>
                            <span className="text-muted-foreground">
                              {resumeData.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {resumeData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 hover:scale-105 cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Education
                        </h4>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, index) => (
                            <div
                              key={index}
                              className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all duration-300"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium text-blue-900">
                                    {edu.degree}
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {edu.institution}
                                  </p>
                                </div>
                                <span className="text-sm text-blue-600 font-medium">
                                  {edu.year}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Experience
                        </h4>
                        <div className="space-y-3">
                          {resumeData.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all duration-300"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium text-blue-900">
                                    {exp.job_title}
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {exp.company}
                                  </p>
                                </div>
                                <span className="text-sm text-blue-600 font-medium">
                                  {exp.years} years
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Current Role
                        </h4>
                        <div className="flex justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="font-medium text-blue-900">
                            Role
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            {resumeData.role}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Upload a resume to see extracted information
                      </p>
                    </div>
                  )}

                  {/* Enhanced Consent */}
                  <div className="pt-6 border-t border-blue-200">
                    <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-all duration-300">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={handleConsentChange}
                        className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5"
                      />
                      <div className="space-y-2">
                        <label
                          htmlFor="consent"
                          className="text-sm font-medium cursor-pointer text-blue-900 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />I consent to secure data
                          processing for job matching
                        </label>
                        <p className="text-xs text-blue-700">
                          We'll use your information to find relevant job
                          opportunities with complete privacy protection. You
                          can withdraw consent at any time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    disabled={!consent || !resumeData}
                    className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                    onClick={async () => {
                      setJobsLoading(true);
                      const data = await fetchJobsApi();
                      setJobs(data);
                      setJobsLoading(false);
                      handleTabChange("matching");
                    }}
                  >
                    <Briefcase className="w-5 h-5 mr-3" />
                    Find Perfect Job Matches
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: Job Matching */}
          <TabsContent value="matching" className="animate-fade-in">
            <div className="space-y-8">
              {/* Header with Search and Filters */}
              <Card className="border-blue-100 shadow-xl bg-gradient-to-r from-white to-blue-50/30">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        Job Matches for {resumeData?.name || "You"}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">
                        Found {filteredJobs.length} perfect matches based on
                        your skills and experience
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <Target className="w-3 h-3 mr-1" />
                        AI Matched
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Real-time
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search jobs or companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Filter by location..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="pl-10 h-12 border-blue-200 focus:border-blue-500 lg:w-64"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="h-12 px-6 border-blue-200 hover:bg-blue-50"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Cards Grid */}
              {jobsLoading ? (
                <div>Loading Jobs…</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/20"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl">
                              {job.logo}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-blue-900 hover:text-blue-700 transition-colors">
                                {job.title}
                              </CardTitle>
                              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <Building className="w-3 h-3" />
                                {job.company}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                            className={`${
                              savedJobs.includes(job.id)
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-400 hover:text-red-500"
                            } transition-colors`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                savedJobs.includes(job.id) ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </div>

                        {/* Match Score */}
                        <div className="flex items-center justify-between mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 relative">
                                <svg
                                  className="w-12 h-12 transform -rotate-90"
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray={`${job.matchScore}, 100`}
                                    className={getMatchColor(
                                      job.matchScore
                                    ).replace("bg-", "text-")}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-700">
                                    {job.matchScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-blue-900">
                                {getMatchLabel(job.matchScore)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Based on your skills
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${getMatchColor(
                              job.matchScore
                            )} text-white border-none`}
                          >
                            {job.matchScore}% Match
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Job Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-muted-foreground">
                              {job.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-muted-foreground">
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-600" />
                            <span className="text-muted-foreground">
                              {job.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-muted-foreground">
                              {job.posted}
                            </span>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {job.description}
                          </p>
                        </div>

                        {/* Skills Match */}
                        <div>
                          <h5 className="font-semibold text-sm text-blue-900 mb-2">
                            Required Skills
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements
                              .slice(0, 4)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className={`text-xs ${
                                    resumeData?.skills.some(
                                      (userSkill) =>
                                        userSkill
                                          .toLowerCase()
                                          .includes(skill.toLowerCase()) ||
                                        skill
                                          .toLowerCase()
                                          .includes(userSkill.toLowerCase())
                                    )
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {job.requirements.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.requirements.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Benefits Preview */}
                        <div>
                          <h5 className="font-semibold text-sm text-blue-900 mb-2">
                            Benefits
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.slice(0, 3).map((benefit, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {benefit}
                              </Badge>
                            ))}
                            {job.benefits.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.benefits.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-blue-100">
                          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-200 hover:bg-blue-50"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No Results State */}
              {filteredJobs.length === 0 && (
                <Card className="text-center py-16 border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                  <CardContent>
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search criteria or location filter
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setLocationFilter("");
                      }}
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
