"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import LaTeXAIAssistant from "../../components/resume/LaTeXAIAssistant";

export default function LaTeXResumePage() {
  const [latexContent, setLatexContent] = useState(`\\documentclass[10pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm,
]{geometry}
\\usepackage[explicit]{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={John Doe's CV},
    pdfauthor={John Doe},
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage[pscoord]{eso-pic}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}

% Ensure that generate pdf is machine readable/ATS parsable:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

\\usepackage[default, type1]{sourcesanspro}

% Some settings:
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\makeatletter
\\let\\ps@customFooterStyle\\ps@plain
\\patchcmd{\\ps@customFooterStyle}{\\thepage}{
    \\color{gray}\\textit{\\small John Doe - Page \\thepage{} of \\pageref*{LastPage}}
}{}{}
\\makeatother
\\pagestyle{customFooterStyle}

\\titleformat{\\section}{
    \\needspace{4\\baselineskip}
    \\Large\\color{primaryColor}
}{
}{
}{
    \\textbf{#1}\\hspace{0.15cm}\\titlerule[0.8pt]\\hspace{-0.1cm}
}[]

\\titlespacing{\\section}{
    -1pt
}{
    0.3 cm
}{
    0.2 cm
}

\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0.4 cm + 10pt
    ]
}{
    \\end{itemize}
}

\\newenvironment{highlightsforbulletentries}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
    ]
}{
    \\end{itemize}
}

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{
        0.2 cm + 0.00001 cm
    }{
        0.2 cm + 0.00001 cm
    }
}{
    \\end{adjustwidth}
}

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
}

\\newenvironment{threecolentry}[3][]{
    \\onecolentry
    \\def\\thirdColumn{#3}
    \\setcolumnwidth{1 cm, \\fill, 4.5 cm}
    \\begin{paracol}{3}
    {\\raggedright #2} \\switchcolumn
}{
    \\switchcolumn \\raggedleft \\thirdColumn
    \\end{paracol}
    \\endonecolentry
}

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\color{primaryColor}\\linespread{1.5}
}{
    \\par\\kern\\topsep
}

\\newcommand{\\placelastupdatedtext}{
  \\AddToShipoutPictureFG*{
    \\put(
        \\LenToUnit{\\paperwidth-2 cm-0.2 cm+0.05cm},
        \\LenToUnit{\\paperheight-1.0 cm}
    ){\\vtop{{\\null}\\makebox[0pt][c]{
        \\small\\color{gray}\\textit{Last updated in September 2024}\\hspace{\\widthof{Last updated in September 2024}}
    }}}
  }
}

\\let\\hrefWithoutArrow\\href
\\renewcommand{\\href}[2]{\\hrefWithoutArrow{#1}{\\ifthenelse{\\equal{#2}{}}{ }{#2 }\\raisebox{.15ex}{\\footnotesize \\faExternalLink*}}}

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{}

    \\placelastupdatedtext
    \\begin{header}
        \\fontsize{30 pt}{30 pt}
        \\textbf{John Doe}

        \\vspace{0.3 cm}

        \\normalsize
        \\mbox{{\\footnotesize\\faMapMarker*}\\hspace*{0.13cm}Your Location}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        \\mbox{\\hrefWithoutArrow{mailto:youremail@yourdomain.com}{{\\footnotesize\\faEnvelope[regular]}\\hspace*{0.13cm}youremail@yourdomain.com}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        \\mbox{\\hrefWithoutArrow{tel:+90-541-999-99-99}{{\\footnotesize\\faPhone*}\\hspace*{0.13cm}0541 999 99 99}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        \\mbox{\\hrefWithoutArrow{https://yourwebsite.com/}{{\\footnotesize\\faLink}\\hspace*{0.13cm}yourwebsite.com}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        \\mbox{\\hrefWithoutArrow{https://linkedin.com/in/yourusername}{{\\footnotesize\\faLinkedinIn}\\hspace*{0.13cm}yourusername}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        \\mbox{\\hrefWithoutArrow{https://github.com/yourusername}{{\\footnotesize\\faGithub}\\hspace*{0.13cm}yourusername}}%
    \\end{header}

    \\vspace{0.3 cm - 0.3 cm}

    \\section{Experience}

    % Your experience entries will go here
    % Use the AI Assistant to generate LaTeX content

    \\section{Education}

    % Your education entries will go here

    \\section{Projects}

    % Your project entries will go here

    \\section{Technologies}

    % Your technology entries will go here

\\end{document}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900">LaTeX Resume</span>
              <br />
              <span className="text-blue-600">with AI Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create professional LaTeX resumes with AI-powered content generation. 
              Generate bullet points, experience entries, and more with just a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* LaTeX Resume Builder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LaTeX Editor */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>LaTeX Resume Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="mt-4">
                      <Textarea
                        value={latexContent}
                        onChange={(e) => setLatexContent(e.target.value)}
                        className="font-mono text-sm h-[600px]"
                        placeholder="Your LaTeX content will appear here..."
                      />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => navigator.clipboard.writeText(latexContent)}>
                          Copy LaTeX
                        </Button>
                        <Button variant="outline" onClick={() => setLatexContent("")}>
                          Clear
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="preview" className="mt-4">
                      <div className="bg-white border rounded-lg p-6 h-[600px] overflow-auto">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-blue-600 mb-2">John Doe</h2>
                          <p className="text-sm text-gray-600">
                            Your Location • youremail@yourdomain.com • 0541 999 99 99
                          </p>
                          <p className="text-sm text-gray-600">
                            yourwebsite.com • yourusername (LinkedIn) • yourusername (GitHub)
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">
                              Experience
                            </h3>
                            <p className="text-sm text-gray-500 italic">
                              Use the AI Assistant to generate experience entries
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">
                              Education
                            </h3>
                            <p className="text-sm text-gray-500 italic">
                              Add your education details here
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">
                              Projects
                            </h3>
                            <p className="text-sm text-gray-500 italic">
                              Use the AI Assistant to generate project entries
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">
                              Technologies
                            </h3>
                            <p className="text-sm text-gray-500 italic">
                              List your technical skills here
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* AI Assistant */}
            <div className="lg:col-span-1">
              <LaTeXAIAssistant />
              
              {/* Instructions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">1. Generate Content</h4>
                    <p className="text-gray-600">
                      Use the AI Assistant to generate LaTeX bullet points, experience entries, or project entries.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2. Copy LaTeX Code</h4>
                    <p className="text-gray-600">
                      Copy the generated LaTeX code and paste it into the editor where you want it to appear.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3. Customize</h4>
                    <p className="text-gray-600">
                      Edit the company names, dates, and other details to match your experience.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4. Compile</h4>
                    <p className="text-gray-600">
                      Use a LaTeX compiler (like Overleaf, TeXstudio, or VS Code with LaTeX Workshop) to generate your PDF.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
