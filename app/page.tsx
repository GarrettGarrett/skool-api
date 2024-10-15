'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Code } from "@/components/ui/code"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ApiResponse {
  [key: string]: any;
  error?: string;
}

export default function Home() {
  const [handle, setHandle] = useState('@sam')
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)

  const handleTryApi = async () => {
    try {
      const response = await fetch(`/api/user/${handle}`)
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error:', error)
      setApiResponse({ error: 'An error occurred while fetching data' })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">User Profile API Documentation</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <Code>GET /api/user/[handle]</Code>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This endpoint retrieves user profile data based on the provided handle.</p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>handle</TableCell>
                <TableCell>string</TableCell>
                <TableCell>The user's handle (with or without '@')</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">The response includes detailed user information such as:</p>
          <ul className="list-disc pl-6">
            <li>User ID</li>
            <li>Name (First and Last)</li>
            <li>Email</li>
            <li>Bio</li>
            <li>Location</li>
            <li>Profile Picture URL</li>
            <li>Social Links</li>
            <li>User Statistics</li>
            <li>Group Memberships</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Example Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Enter your handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">JavaScript</h3>
            <div className="relative">
              <Code>
{`fetch('/api/user/${handle}')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
              </Code>
              <Button
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(`fetch('/api/user/${handle}')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`)}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Python</h3>
            <div className="relative">
              <Code>
{`import requests

response = requests.get(f'https://your-api-domain.com/api/user/${handle}')
data = response.json()
print(data)`}
              </Code>
              <Button
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(`import requests

response = requests.get(f'https://your-api-domain.com/api/user/${handle}')
data = response.json()
print(data)`)}
              >
                Copy
              </Button>
            </div>
          </div>
          <Button onClick={handleTryApi}>Try API</Button>
          {apiResponse && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">API Response</h3>
              <pre className="bg-background p-4 rounded-md overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
        </CardHeader>
        <CardContent>
          <p>If an error occurs, the API will return a JSON object with an error message and a 500 status code.</p>
        </CardContent>
      </Card>
    </div>
  )
}
