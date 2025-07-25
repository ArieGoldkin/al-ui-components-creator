# Supabase MCP Setup Guide

This guide helps you set up Supabase Model Context Protocol (MCP) for the AI Component Builder project, allowing AI tools to interact directly with your Supabase database and project.

## 🎯 Benefits for AI Component Builder

With Supabase MCP, your AI assistant can:
- **Database Management**: Create tables for component metadata, user preferences, etc.
- **Schema Analysis**: Understand your database structure to suggest better components
- **Data Operations**: Query component usage statistics and analytics
- **Project Configuration**: Help manage Supabase project settings
- **Development Assistance**: Provide context-aware suggestions based on your data

## 📋 Prerequisites

1. **Supabase Project**: You need an active Supabase project
2. **AI Development Tool**: One of the supported tools (Cursor, VS Code, Claude, etc.)
3. **Node.js**: Required for running the MCP server via npx

## 🔧 Step 1: Create Personal Access Token

1. Go to [Supabase Settings → Access Tokens](https://supabase.com/dashboard/account/tokens)
2. Click "Generate new token"
3. Name: `AI Component Builder MCP`
4. Description: `MCP server access for AI Component Builder development`
5. Copy the generated token (you'll need it for configuration)

## 🎯 Step 2: Get Your Project Reference

1. Go to your Supabase project dashboard
2. Navigate to Settings → General
3. Copy your "Project Reference" (looks like: `abcdefghijklmnop`)

## ⚙️ Step 3: Configure Your AI Tool

### For Cursor IDE

1. The `.cursor/mcp.json` file has been created in your project root
2. Edit the file and replace:
   - `YOUR_PROJECT_REF_HERE` with your project reference
   - `YOUR_PERSONAL_ACCESS_TOKEN_HERE` with your personal access token

3. Save the file and restart Cursor
4. Go to Settings → MCP to verify the connection (should show green status)

### For VS Code (Copilot)

1. The `.vscode/mcp.json` file has been created in your project root
2. Edit the file and replace `YOUR_PROJECT_REF_HERE` with your project reference
3. Save the file and restart VS Code
4. Open Copilot chat and switch to "Agent" mode
5. You'll be prompted to enter your personal access token when first using the server

### For Claude Desktop

1. Open Claude Desktop → Settings → Developer → Edit Config
2. Copy the contents from `.mcp.json` in your project root
3. Replace the placeholder values with your actual project ref and token
4. Save and restart Claude Desktop

### For Other Tools

The `.mcp.json` file in your project root can be adapted for other MCP-compatible tools. Refer to the [Supabase MCP documentation](https://supabase.com/docs/guides/getting-started/mcp) for specific instructions.

## 🔒 Security Best Practices

### Read-Only Mode (Recommended)
All configurations use `--read-only` mode by default, which:
- Prevents accidental data modifications
- Allows safe exploration of your database
- Still permits project management operations

### Project Scoping
The configuration is scoped to your specific project using `--project-ref`, limiting access to only that project's resources.

### Development Environment Only
**Important**: Only use MCP with development/staging databases, never with production data containing sensitive information.

## 🧪 Testing the Setup

Once configured, test your MCP connection by asking your AI assistant:

```
"Can you show me the tables in my Supabase database?"
```

```
"Help me create a table for storing component metadata"
```

```
"What's the current configuration of my Supabase project?"
```

## 🛠️ Available MCP Tools

The Supabase MCP server provides these tools:
- `list_projects` - List all your Supabase projects
- `get_project_config` - Get project configuration
- `list_tables` - List database tables
- `describe_table` - Get table schema
- `run_sql` - Execute SQL queries (read-only)
- `create_table` - Create new tables
- `get_project_api_keys` - Get API keys
- And more...

For a complete list, see the [GitHub README](https://github.com/supabase-community/supabase-mcp#tools).

## 🚨 Troubleshooting

### Connection Issues
- Verify your personal access token is correct
- Check that your project reference is accurate
- Ensure you have internet connectivity for npx to download the server

### Permission Errors
- Confirm your personal access token has the necessary permissions
- Check that you're the owner or have admin access to the Supabase project

### Tool Not Appearing
- Restart your AI development tool after configuration
- Check the MCP server status in your tool's settings
- Verify the JSON configuration syntax is correct

## 🔄 Updating

To update the Supabase MCP server:
```bash
npx @supabase/mcp-server-supabase@latest --version
```

The `@latest` tag in the configuration ensures you always get the newest version.

## 📚 Next Steps

With Supabase MCP configured, you can:
1. **Database Design**: Ask AI to help design optimal schemas for component storage
2. **Analytics Setup**: Create tables for tracking component usage and performance
3. **User Management**: Set up authentication and user preference storage
4. **API Integration**: Get help connecting your backend to Supabase services

## 🔗 Useful Links

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [MCP Server GitHub](https://github.com/supabase-community/supabase-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [Supabase Dashboard](https://supabase.com/dashboard)
