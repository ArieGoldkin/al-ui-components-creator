# Supabase MCP Tools for Augment Agent

## Tool Configuration
The Augment Agent has access to Supabase MCP tools through the configuration in `.augment/mcp.json`.

## Available Tools

### Database Inspection
- **list_tables**: Show all database tables
- **execute_sql**: Run read-only SQL queries
- **list_extensions**: Show installed PostgreSQL extensions
- **list_migrations**: Show migration history

### Project Management  
- **get_project**: Get project configuration and details
- **get_project_url**: Get API endpoints
- **get_anon_key**: Get anonymous API key

### Development Assistance
- **generate_typescript_types**: Generate TypeScript interfaces from database schema
- **search_docs**: Search Supabase documentation for answers
- **get_logs**: View service logs for debugging
- **get_advisors**: Get security and performance recommendations

### Schema Management
- **apply_migration**: Apply SQL migrations (tracked changes)
- **list_migrations**: View migration history

## Usage Guidelines

### When to Use MCP Tools
1. **Database Schema Questions**: Use `list_tables` and `execute_sql`
2. **Type Generation**: Use `generate_typescript_types` for React components
3. **Debugging**: Use `get_logs` and `get_advisors`
4. **Documentation**: Use `search_docs` for Supabase features
5. **Project Info**: Use `get_project` for configuration details

### Safety Considerations
- All tools are in read-only mode for safety
- `execute_sql` cannot modify data (SELECT queries only)
- `apply_migration` is available but should be used carefully
- Always review generated SQL before applying migrations

### Integration with AI Component Builder
Use MCP tools to:
- Design optimal database schemas for component storage
- Generate TypeScript types for component props
- Query component usage analytics
- Debug database connection issues
- Get recommendations for performance optimization

## Example Workflows

### Schema Design
1. Use `list_tables` to see current structure
2. Use `execute_sql` to analyze existing data
3. Use `apply_migration` to create new tables
4. Use `generate_typescript_types` to create interfaces

### Debugging
1. Use `get_logs` to check for errors
2. Use `get_advisors` for performance issues
3. Use `search_docs` for solutions
4. Use `execute_sql` to verify data integrity

### Development
1. Use `get_project_url` for API endpoints
2. Use `get_anon_key` for authentication
3. Use `generate_typescript_types` for type safety
4. Use `list_extensions` to check available features
