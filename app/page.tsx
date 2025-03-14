'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Code } from "@/components/ui/code"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Copy, Play } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ApiResponse {
  [key: string]: any;
  error?: string;
}

interface EndpointExample {
  title: string;
  description: string;
  method: string;
  endpoint: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  responses: {
    code: number;
    description: string;
    example: any;
  }[];
  sampleCode: {
    javascript: string;
    python: string;
  };
}

export default function Home() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('user')
  const [handle, setHandle] = useState('@sam')
  const [communityHandle, setCommunityHandle] = useState('skoolers')
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const handleTryUserApi = async () => {
    setLoading(true)
    try {
      const cleanHandle = handle.trim()
      const response = await fetch(`/api/user/${cleanHandle}`)
      const data = await response.json()
      setApiResponse(data)
      setStatusCode(response.status)
    } catch (error) {
      console.error('Error:', error)
      setApiResponse({ error: 'An error occurred while fetching data' })
      setStatusCode(500)
    } finally {
      setLoading(false)
    }
  }

  const handleTryCommunityApi = async () => {
    setLoading(true)
    try {
      const cleanHandle = communityHandle.trim()
      const response = await fetch(`/api/community/${cleanHandle}`)
      const data = await response.json()
      setApiResponse(data)
      setStatusCode(response.status)
    } catch (error) {
      console.error('Error:', error)
      setApiResponse({ error: 'An error occurred while fetching data' })
      setStatusCode(500)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const endpoints: Record<string, EndpointExample> = {
    user: {
      title: "User Profile",
      description: "Retrieves detailed user profile data from Skool based on the provided handle.",
      method: "GET",
      endpoint: "/api/user/[handle]",
      parameters: [
        {
          name: "handle",
          type: "string",
          description: "The user's handle (with or without '@')",
          required: true
        }
      ],
      responses: [
        {
          code: 200,
          description: "Successful response",
          example: {
            id: "59e737d659f24e69a3810c6191054efd",
            name: "Sam Ovens",
            firstName: "Sam",
            lastName: "Ovens",
            email: "",
            bio: "CEO @ Skool",
            location: "Los Angeles, CA",
            createdAt: "2019-08-20T01:47:33.742649Z",
            updatedAt: "2025-03-14T22:14:55.468517Z",
            profilePicture: "https://assets.skool.com/f/59e737d659f24e69a3810c6191054efd/d3a1416b9cc54ef69da4b2c33a7d752fad80bff0bd1e473db85a46373dfffca5",
            socialLinks: {
              facebook: "",
              instagram: "",
              linkedin: "",
              twitter: "",
              website: "",
              youtube: ""
            },
            stats: {
              totalPosts: 2875,
              totalFollowers: 240110,
              totalFollowing: 16,
              totalSharedGroups: 0
            },
            groups: {
              memberOf: [
                {
                  id: "32b357ddc07148339eaafd40d6dd291b",
                  name: "crafts",
                  displayName: "Kids Craft Club",
                  description: "Stress-free crafts, fun coloring sheets and uplifting affirmations.",
                  totalMembers: 18,
                  totalPosts: 16
                }
              ],
              createdByUser: [
                {
                  id: "e44528d24bfe4d65b0a412441feaa489",
                  name: "skoolers",
                  displayName: "Skoolers",
                  description: "Private club for skool owners. Let's build communities together.",
                  totalMembers: 52537,
                  totalPosts: 58601
                }
              ]
            },
            pageTitle: "Sam Ovens",
            pageMeta: {
              title: "Sam Ovens",
              description: "CEO @ Skool",
              image: "https://assets.skool.com/f/59e737d659f24e69a3810c6191054efd/d3a1416b9cc54ef69da4b2c33a7d752fad80bff0bd1e473db85a46373dfffca5-sm.jpg",
              touchIcon: "https://assets.skool.com/skool/8d5e2d4df1b645148f07ae0d9df14c51.png"
            }
          }
        },
        {
          code: 404,
          description: "User not found",
          example: {
            error: "User not found",
            message: "The specified handle does not exist"
          }
        },
        {
          code: 500,
          description: "Server error",
          example: {
            error: "Failed to fetch user data",
            message: "An internal server error occurred"
          }
        }
      ],
      sampleCode: {
        javascript: `fetch('https://skool-api.vercel.app/api/user/@handle')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.get('https://skool-api.vercel.app/api/user/@handle')
data = response.json()
print(data)`
      }
    },
    community: {
      title: "Community",
      description: "Retrieves detailed community data from Skool based on the provided handle.",
      method: "GET",
      endpoint: "/api/community/[handle]",
      parameters: [
        {
          name: "handle",
          type: "string",
          description: "The community handle without '@'",
          required: true
        }
      ],
      responses: [
        {
          code: 200,
          description: "Successful response",
          example: {
            name: "Skoolers",
            meta: {
              description: "Private club for skool owners. Let's build communities together.",
              image: "https://assets.skool.com/f/e44528d24bfe4d65b0a412441feaa489/c50dab9557104775b0d65b409ae54ad83788c52e95334fcdaa8ffc67ca3f9436",
              title: "Skoolers",
              touchIcon: "https://assets.skool.com/f/e44528d24bfe4d65b0a412441feaa489/e5b00302d72a4167b9eb2f6a796f821b09ff0a5154324b5ba383607276647a15"
            },
            mainMenuName: "group-default",
            mainMenuItem: "about",
            previousPageBack: false,
            courseRoute: false,
            id: "e44528d24bfe4d65b0a412441feaa489",
            handle: "skoolers",
            displayName: "Skoolers",
            description: "Private club for skool owners. Let's build communities together.",
            logo: "https://assets.skool.com/f/e44528d24bfe4d65b0a412441feaa489/e5b00302d72a4167b9eb2f6a796f821b09ff0a5154324b5ba383607276647a15",
            banner: "https://assets.skool.com/f/e44528d24bfe4d65b0a412441feaa489/bbe8b6178f4b448895fa4f103d84a8a34be1e1c9c5a94170bfb9379506291155-md.jpg",
            favicon: "https://assets.skool.com/f/e44528d24bfe4d65b0a412441feaa489/f3c1cc9e87544e38a08d60f7a4b98e4eb7baf2c46e07465ab9f71dec8ea91d18",
            color: "#FCB900",
            initials: "S",
            stats: {
              totalMembers: 52537,
              totalOnlineMembers: 747,
              totalPosts: 58601,
              totalAdmins: 9,
              totalRules: 5
            },
            calendarEnabled: false,
            membership: 1,
            privacy: 1,
            minPostLevel: 2,
            owner: {
              id: "59e737d659f24e69a3810c6191054efd",
              name: "sam",
              firstName: "Sam",
              lastName: "Ovens",
              profilePicture: "https://assets.skool.com/f/59e737d659f24e69a3810c6191054efd/d3a1416b9cc54ef69da4b2c33a7d752fad80bff0bd1e473db85a46373dfffca5",
              bio: "CEO @ Skool",
              location: "Los Angeles, CA",
              createdAt: "2019-08-20T01:47:33.742649Z",
              updatedAt: "2025-03-06T17:05:18.352648Z"
            },
            createdAt: "2019-12-04T04:52:35.870973Z",
            updatedAt: "2025-03-14T22:16:18.827345Z",
            labels: [],
            onlineUsers: []
          }
        },
        {
          code: 404,
          description: "Community not found",
          example: {
            error: "Community not found",
            message: "The specified community handle does not exist"
          }
        },
        {
          code: 500,
          description: "Server error",
          example: {
            error: "Failed to fetch community data",
            message: "An internal server error occurred"
          }
        }
      ],
      sampleCode: {
        javascript: `fetch('https://skool-api.vercel.app/api/community/community-handle')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.get('https://skool-api.vercel.app/api/community/community-handle')
data = response.json()
print(data)`
      }
    }
  }

  const getResponseStatusBadge = (code: number | null) => {
    if (code === null) return null
    
    if (code >= 200 && code < 300) {
      return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Success ({code})</Badge>
    } else if (code >= 400 && code < 500) {
      return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" /> Client Error ({code})</Badge>
    } else {
      return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" /> Server Error ({code})</Badge>
    }
  }

  const activeEndpointData = endpoints[activeEndpoint]

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <h1 className="text-4xl font-bold mb-2">Skool API Documentation</h1>
      <p className="text-muted-foreground mb-6">Access user profiles and community data from Skool</p>
      
      <Tabs defaultValue="user" onValueChange={setActiveEndpoint} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Profile API</TabsTrigger>
          <TabsTrigger value="community">Community API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{activeEndpointData.title}</CardTitle>
                  <CardDescription>{activeEndpointData.description}</CardDescription>
                </div>
                <Badge className="bg-blue-500">{activeEndpointData.method}</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <Code className="text-lg">{activeEndpointData.endpoint}</Code>
              <p className="text-sm text-muted-foreground mt-2">Base URL: <code>https://skool-api.vercel.app</code></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEndpointData.parameters.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell><code>{param.name}</code></TableCell>
                      <TableCell>{param.type}</TableCell>
                      <TableCell>{param.description}</TableCell>
                      <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEndpointData.responses.map((response) => (
                <div key={response.code} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      response.code >= 200 && response.code < 300 ? "bg-green-500" :
                      response.code >= 400 && response.code < 500 ? "bg-yellow-500" : "bg-red-500"
                    }>
                      {response.code}
                    </Badge>
                    <span className="font-medium">{response.description}</span>
                  </div>
                  <div className="relative">
                    <Code className="text-xs max-h-60 overflow-auto">
                      {JSON.stringify(response.example, null, 2)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Try It Out</CardTitle>
              <CardDescription>Test the API with your own parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User Handle</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter user handle (e.g. @sam)"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleTryUserApi} 
                      disabled={loading}
                      className="flex-shrink-0"
                    >
                      {loading ? "Loading..." : "Execute"}
                      {!loading && <Play className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {statusCode && (
                  <div className="flex justify-end">
                    {getResponseStatusBadge(statusCode)}
                  </div>
                )}

                {apiResponse && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Response</h3>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Code</CardTitle>
              <CardDescription>Use these examples to get started with the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">JavaScript / Fetch</h3>
                  <div className="relative">
                    <Code>
                      {activeEndpointData.sampleCode.javascript.replace('@handle', handle)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(activeEndpointData.sampleCode.javascript.replace('@handle', handle))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Python / Requests</h3>
                  <div className="relative">
                    <Code>
                      {activeEndpointData.sampleCode.python.replace('@handle', handle)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(activeEndpointData.sampleCode.python.replace('@handle', handle))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{endpoints.community.title}</CardTitle>
                  <CardDescription>{endpoints.community.description}</CardDescription>
                </div>
                <Badge className="bg-blue-500">{endpoints.community.method}</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <Code className="text-lg">{endpoints.community.endpoint}</Code>
              <p className="text-sm text-muted-foreground mt-2">Base URL: <code>https://skool-api.vercel.app</code></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpoints.community.parameters.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell><code>{param.name}</code></TableCell>
                      <TableCell>{param.type}</TableCell>
                      <TableCell>{param.description}</TableCell>
                      <TableCell>{param.required ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoints.community.responses.map((response) => (
                <div key={response.code} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      response.code >= 200 && response.code < 300 ? "bg-green-500" :
                      response.code >= 400 && response.code < 500 ? "bg-yellow-500" : "bg-red-500"
                    }>
                      {response.code}
                    </Badge>
                    <span className="font-medium">{response.description}</span>
                  </div>
                  <div className="relative">
                    <Code className="text-xs max-h-60 overflow-auto">
                      {JSON.stringify(response.example, null, 2)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Try It Out</CardTitle>
              <CardDescription>Test the API with your own parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Community Handle</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter community handle (e.g. skoolers)"
                      value={communityHandle}
                      onChange={(e) => setCommunityHandle(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleTryCommunityApi} 
                      disabled={loading}
                      className="flex-shrink-0"
                    >
                      {loading ? "Loading..." : "Execute"}
                      {!loading && <Play className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {statusCode && (
                  <div className="flex justify-end">
                    {getResponseStatusBadge(statusCode)}
                  </div>
                )}

                {apiResponse && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Response</h3>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Code</CardTitle>
              <CardDescription>Use these examples to get started with the API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">JavaScript / Fetch</h3>
                  <div className="relative">
                    <Code>
                      {endpoints.community.sampleCode.javascript.replace('community-handle', communityHandle)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoints.community.sampleCode.javascript.replace('community-handle', communityHandle))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Python / Requests</h3>
                  <div className="relative">
                    <Code>
                      {endpoints.community.sampleCode.python.replace('community-handle', communityHandle)}
                    </Code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoints.community.sampleCode.python.replace('community-handle', communityHandle))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      
    </div>
  )
}
