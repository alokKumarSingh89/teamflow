import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const GRAPHQL_URL =
  process.env.TEAMFLOW_GRAPHQL_URL ?? 'http://localhost:3000/graphql';

const OUTPUT_FILE = resolve(process.cwd(), 'scripts/data/teamflow-data.json');

/**
 * --------------------------------------------------------------------------
 * GraphQL helper
 * --------------------------------------------------------------------------
 */

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `GraphQL HTTP error ${response.status}: ${JSON.stringify(body)}`,
    );
  }

  if (body.errors?.length) {
    throw new Error(`GraphQL error:\n${JSON.stringify(body.errors, null, 2)}`);
  }

  return body.data;
}

/**
 * --------------------------------------------------------------------------
 * Queries
 * --------------------------------------------------------------------------
 */

const USERS_QUERY = `
  query Users {
    users {
      id
      name
      email
      status
    }
  }
`;

const ORGANIZATIONS_QUERY = `
  query Organizations {
    organizations {
      id
      name
      status
    }
  }
`;

const TEAMS_QUERY = `
  query TeamsByOrganization($organizationId: ID!) {
    teamsByOrganization(organizationId: $organizationId) {
      id
      name
      status
    }
  }
`;

const PROJECTS_QUERY = `
  query ProjectsByOrganization($organizationId: ID!) {
    projectsByOrganization(organizationId: $organizationId) {
      id
      name
      description
      status
      ownerId
    }
  }
`;

const TASKS_QUERY = `
  query TasksByProject($projectId: ID!) {
    tasksByProject(projectId: $projectId) {
      id
      title
      status
      priority
      projectId
      assigneeId
      createdById
    }
  }
`;

/**
 * --------------------------------------------------------------------------
 * Mutations
 * --------------------------------------------------------------------------
 */

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      status
    }
  }
`;

const CREATE_ORGANIZATION_MUTATION = `
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      status
    }
  }
`;

const CREATE_TEAM_MUTATION = `
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      status
    }
  }
`;

const CREATE_PROJECT_MUTATION = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      ownerId
    }
  }
`;

const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      status
      priority
      projectId
      assigneeId
      createdById
    }
  }
`;

/**
 * --------------------------------------------------------------------------
 * GraphQL operations
 * --------------------------------------------------------------------------
 */

async function getUsers() {
  const data = await graphqlRequest(USERS_QUERY);
  return data.users;
}

async function getOrganizations() {
  const data = await graphqlRequest(ORGANIZATIONS_QUERY);
  return data.organizations;
}

async function getTeams(organizationId) {
  const data = await graphqlRequest(TEAMS_QUERY, {
    organizationId,
  });

  return data.teamsByOrganization;
}

async function getProjects(organizationId) {
  const data = await graphqlRequest(PROJECTS_QUERY, {
    organizationId,
  });

  return data.projectsByOrganization;
}

async function getTasks(projectId) {
  const data = await graphqlRequest(TASKS_QUERY, {
    projectId,
  });

  return data.tasksByProject;
}

async function createUser({ name, email }) {
  const data = await graphqlRequest(CREATE_USER_MUTATION, {
    input: {
      name,
      email,
    },
  });

  return data.createUser;
}

async function createOrganization({ name, ownerId }) {
  const data = await graphqlRequest(CREATE_ORGANIZATION_MUTATION, {
    input: {
      name,
      ownerId,
    },
  });

  return data.createOrganization;
}

async function createTeam({ organizationId, name }) {
  const data = await graphqlRequest(CREATE_TEAM_MUTATION, {
    input: {
      organizationId,
      name,
    },
  });

  return data.createTeam;
}

async function createProject({ organizationId, name, description, ownerId }) {
  const data = await graphqlRequest(CREATE_PROJECT_MUTATION, {
    input: {
      organizationId,
      name,
      description,
      ownerId,
    },
  });

  return data.createProject;
}

async function createTask({
  projectId,
  title,
  priority,
  assigneeId,
  createdById,
}) {
  const data = await graphqlRequest(CREATE_TASK_MUTATION, {
    input: {
      projectId,
      title,
      priority,
      assigneeId,
      createdById,
    },
  });

  return data.createTask;
}

/**
 * --------------------------------------------------------------------------
 * Seed definitions
 * --------------------------------------------------------------------------
 */

const users = [
  {
    key: 'alice',
    name: 'Alice',
    email: 'alice@teamflow.dev',
  },
  {
    key: 'bob',
    name: 'Bob',
    email: 'bob@teamflow.dev',
  },
  {
    key: 'charlie',
    name: 'Charlie',
    email: 'charlie@teamflow.dev',
  },
  {
    key: 'david',
    name: 'David',
    email: 'david@teamflow.dev',
  },
  {
    key: 'emma',
    name: 'Emma',
    email: 'emma@teamflow.dev',
  },
  {
    key: 'frank',
    name: 'Frank',
    email: 'frank@teamflow.dev',
  },
  {
    key: 'grace',
    name: 'Grace',
    email: 'grace@teamflow.dev',
  },
  {
    key: 'henry',
    name: 'Henry',
    email: 'henry@teamflow.dev',
  },
  {
    key: 'isla',
    name: 'Isla',
    email: 'isla@teamflow.dev',
  },
  {
    key: 'jack',
    name: 'Jack',
    email: 'jack@teamflow.dev',
  },
  {
    key: 'karen',
    name: 'Karen',
    email: 'karen@teamflow.dev',
  },
  {
    key: 'liam',
    name: 'Liam',
    email: 'liam@teamflow.dev',
  },
  {
    key: 'mia',
    name: 'Mia',
    email: 'mia@teamflow.dev',
  },
  {
    key: 'noah',
    name: 'Noah',
    email: 'noah@teamflow.dev',
  },
  {
    key: 'olivia',
    name: 'Olivia',
    email: 'olivia@teamflow.dev',
  },
  {
    key: 'peter',
    name: 'Peter',
    email: 'peter@teamflow.dev',
  },
  {
    key: 'quinn',
    name: 'Quinn',
    email: 'quinn@teamflow.dev',
  },
  {
    key: 'ruby',
    name: 'Ruby',
    email: 'ruby@teamflow.dev',
  },
  {
    key: 'sam',
    name: 'Sam',
    email: 'sam@teamflow.dev',
  },
  {
    key: 'tina',
    name: 'Tina',
    email: 'tina@teamflow.dev',
  },
];

const organizationDefinitions = [
  {
    key: 'teamflow',
    name: 'TeamFlow',
    owner: 'alice',
  },
  {
    key: 'acme',
    name: 'Acme Engineering',
    owner: 'bob',
  },
  {
    key: 'nova',
    name: 'Nova Labs',
    owner: 'charlie',
  },
  {
    key: 'orbit',
    name: 'Orbit Systems',
    owner: 'david',
  },
  {
    key: 'pixel',
    name: 'Pixel Works',
    owner: 'emma',
  },
  {
    key: 'vertex',
    name: 'Vertex Digital',
    owner: 'frank',
  },
  {
    key: 'zenith',
    name: 'Zenith Software',
    owner: 'grace',
  },
  {
    key: 'apex',
    name: 'Apex Technologies',
    owner: 'henry',
  },
];

const teamNames = ['Backend', 'Frontend', 'Mobile', 'QA', 'DevOps'];

const projectDefinitions = [
  {
    key: 'backend',
    name: 'TeamFlow Backend',
    description: 'Core TeamFlow backend platform',
    owner: 'alice',
    organization: 'teamflow',
  },
  {
    key: 'web',
    name: 'TeamFlow Web',
    description: 'TeamFlow web application',
    owner: 'bob',
    organization: 'teamflow',
  },
  {
    key: 'mobile',
    name: 'TeamFlow Mobile',
    description: 'TeamFlow mobile application',
    owner: 'charlie',
    organization: 'teamflow',
  },
  {
    key: 'infrastructure',
    name: 'TeamFlow Infrastructure',
    description: 'Cloud infrastructure and deployment',
    owner: 'david',
    organization: 'teamflow',
  },
  {
    key: 'qa',
    name: 'TeamFlow QA',
    description: 'Automated quality and integration testing',
    owner: 'emma',
    organization: 'teamflow',
  },
  {
    key: 'acme-platform',
    name: 'Acme Platform',
    description: 'Acme engineering platform',
    owner: 'bob',
    organization: 'acme',
  },
  {
    key: 'nova-ai',
    name: 'Nova AI Platform',
    description: 'Nova Labs AI platform',
    owner: 'charlie',
    organization: 'nova',
  },
  {
    key: 'orbit-cloud',
    name: 'Orbit Cloud',
    description: 'Orbit cloud infrastructure',
    owner: 'david',
    organization: 'orbit',
  },
  {
    key: 'pixel-design',
    name: 'Pixel Design System',
    description: 'Shared UI and design system',
    owner: 'emma',
    organization: 'pixel',
  },
  {
    key: 'vertex-platform',
    name: 'Vertex Platform',
    description: 'Vertex digital platform',
    owner: 'frank',
    organization: 'vertex',
  },
];

const taskDefinitions = [
  {
    key: 'design-graphql-api',
    title: 'Design GraphQL API',
    priority: 'HIGH',
    project: 'backend',
    assignee: 'bob',
    createdBy: 'alice',
  },
  {
    key: 'implement-federation',
    title: 'Implement Federation',
    priority: 'HIGH',
    project: 'backend',
    assignee: 'charlie',
    createdBy: 'alice',
  },
  {
    key: 'add-pagination',
    title: 'Add pagination',
    priority: 'MEDIUM',
    project: 'backend',
    assignee: 'david',
    createdBy: 'alice',
  },
  {
    key: 'dataloader',
    title: 'Implement DataLoader',
    priority: 'HIGH',
    project: 'backend',
    assignee: 'emma',
    createdBy: 'alice',
  },
  {
    key: 'graphql-caching',
    title: 'Implement GraphQL caching',
    priority: 'MEDIUM',
    project: 'backend',
    assignee: 'frank',
    createdBy: 'alice',
  },

  {
    key: 'build-dashboard',
    title: 'Build dashboard',
    priority: 'HIGH',
    project: 'web',
    assignee: 'emma',
    createdBy: 'bob',
  },
  {
    key: 'build-project-screen',
    title: 'Build project screen',
    priority: 'MEDIUM',
    project: 'web',
    assignee: 'frank',
    createdBy: 'bob',
  },
  {
    key: 'responsive-layout',
    title: 'Add responsive layout',
    priority: 'LOW',
    project: 'web',
    assignee: 'grace',
    createdBy: 'bob',
  },
  {
    key: 'activity-screen',
    title: 'Build activity screen',
    priority: 'MEDIUM',
    project: 'web',
    assignee: 'isla',
    createdBy: 'bob',
  },
  {
    key: 'project-filters',
    title: 'Add project filters',
    priority: 'HIGH',
    project: 'web',
    assignee: 'jack',
    createdBy: 'bob',
  },

  {
    key: 'mobile-ui',
    title: 'Build mobile UI',
    priority: 'MEDIUM',
    project: 'mobile',
    assignee: 'alice',
    createdBy: 'charlie',
  },
  {
    key: 'mobile-navigation',
    title: 'Implement navigation',
    priority: 'HIGH',
    project: 'mobile',
    assignee: 'david',
    createdBy: 'charlie',
  },
  {
    key: 'push-notifications',
    title: 'Add push notifications',
    priority: 'HIGH',
    project: 'mobile',
    assignee: 'henry',
    createdBy: 'charlie',
  },
  {
    key: 'offline-mode',
    title: 'Implement offline mode',
    priority: 'MEDIUM',
    project: 'mobile',
    assignee: 'olivia',
    createdBy: 'charlie',
  },
  {
    key: 'mobile-performance',
    title: 'Improve mobile performance',
    priority: 'HIGH',
    project: 'mobile',
    assignee: 'quinn',
    createdBy: 'charlie',
  },

  {
    key: 'kubernetes',
    title: 'Setup Kubernetes',
    priority: 'URGENT',
    project: 'infrastructure',
    assignee: 'david',
    createdBy: 'alice',
  },
  {
    key: 'monitoring',
    title: 'Configure monitoring',
    priority: 'HIGH',
    project: 'infrastructure',
    assignee: 'frank',
    createdBy: 'david',
  },
  {
    key: 'cicd',
    title: 'Setup CI/CD',
    priority: 'HIGH',
    project: 'infrastructure',
    assignee: 'grace',
    createdBy: 'david',
  },
  {
    key: 'logging',
    title: 'Configure centralized logging',
    priority: 'MEDIUM',
    project: 'infrastructure',
    assignee: 'henry',
    createdBy: 'david',
  },
  {
    key: 'security-scanning',
    title: 'Add security scanning',
    priority: 'HIGH',
    project: 'infrastructure',
    assignee: 'tina',
    createdBy: 'david',
  },

  {
    key: 'integration-tests',
    title: 'Write integration tests',
    priority: 'HIGH',
    project: 'qa',
    assignee: 'emma',
    createdBy: 'emma',
  },
  {
    key: 'graphql-tests',
    title: 'Add GraphQL tests',
    priority: 'MEDIUM',
    project: 'qa',
    assignee: 'henry',
    createdBy: 'emma',
  },
  {
    key: 'federation-tests',
    title: 'Add federation tests',
    priority: 'HIGH',
    project: 'qa',
    assignee: 'isla',
    createdBy: 'emma',
  },
  {
    key: 'e2e-tests',
    title: 'Add end-to-end tests',
    priority: 'HIGH',
    project: 'qa',
    assignee: 'jack',
    createdBy: 'emma',
  },
  {
    key: 'load-tests',
    title: 'Add GraphQL load tests',
    priority: 'MEDIUM',
    project: 'qa',
    assignee: 'karen',
    createdBy: 'emma',
  },

  {
    key: 'acme-api',
    title: 'Build Acme API',
    priority: 'HIGH',
    project: 'acme-platform',
    assignee: 'bob',
    createdBy: 'bob',
  },
  {
    key: 'acme-auth',
    title: 'Implement Acme authentication',
    priority: 'HIGH',
    project: 'acme-platform',
    assignee: 'liam',
    createdBy: 'bob',
  },
  {
    key: 'acme-dashboard',
    title: 'Build Acme dashboard',
    priority: 'MEDIUM',
    project: 'acme-platform',
    assignee: 'mia',
    createdBy: 'bob',
  },
  {
    key: 'acme-reporting',
    title: 'Add reporting',
    priority: 'LOW',
    project: 'acme-platform',
    assignee: 'noah',
    createdBy: 'bob',
  },
  {
    key: 'acme-audit',
    title: 'Add audit logging',
    priority: 'HIGH',
    project: 'acme-platform',
    assignee: 'olivia',
    createdBy: 'bob',
  },

  {
    key: 'nova-models',
    title: 'Build AI model service',
    priority: 'URGENT',
    project: 'nova-ai',
    assignee: 'charlie',
    createdBy: 'charlie',
  },
  {
    key: 'nova-prompts',
    title: 'Create prompt management',
    priority: 'HIGH',
    project: 'nova-ai',
    assignee: 'peter',
    createdBy: 'charlie',
  },
  {
    key: 'nova-evaluation',
    title: 'Add model evaluation',
    priority: 'HIGH',
    project: 'nova-ai',
    assignee: 'quinn',
    createdBy: 'charlie',
  },
  {
    key: 'nova-observability',
    title: 'Add AI observability',
    priority: 'MEDIUM',
    project: 'nova-ai',
    assignee: 'ruby',
    createdBy: 'charlie',
  },
  {
    key: 'nova-cost',
    title: 'Track AI usage cost',
    priority: 'MEDIUM',
    project: 'nova-ai',
    assignee: 'sam',
    createdBy: 'charlie',
  },

  {
    key: 'orbit-network',
    title: 'Design cloud network',
    priority: 'HIGH',
    project: 'orbit-cloud',
    assignee: 'david',
    createdBy: 'david',
  },
  {
    key: 'orbit-deployments',
    title: 'Automate deployments',
    priority: 'HIGH',
    project: 'orbit-cloud',
    assignee: 'tina',
    createdBy: 'david',
  },
  {
    key: 'orbit-alerting',
    title: 'Configure alerting',
    priority: 'MEDIUM',
    project: 'orbit-cloud',
    assignee: 'sam',
    createdBy: 'david',
  },
  {
    key: 'orbit-backups',
    title: 'Configure backups',
    priority: 'HIGH',
    project: 'orbit-cloud',
    assignee: 'ruby',
    createdBy: 'david',
  },
  {
    key: 'orbit-dr',
    title: 'Implement disaster recovery',
    priority: 'URGENT',
    project: 'orbit-cloud',
    assignee: 'peter',
    createdBy: 'david',
  },

  {
    key: 'pixel-tokens',
    title: 'Create design tokens',
    priority: 'HIGH',
    project: 'pixel-design',
    assignee: 'emma',
    createdBy: 'emma',
  },
  {
    key: 'pixel-components',
    title: 'Build component library',
    priority: 'HIGH',
    project: 'pixel-design',
    assignee: 'frank',
    createdBy: 'emma',
  },
  {
    key: 'pixel-accessibility',
    title: 'Improve accessibility',
    priority: 'HIGH',
    project: 'pixel-design',
    assignee: 'grace',
    createdBy: 'emma',
  },
  {
    key: 'pixel-documentation',
    title: 'Write component documentation',
    priority: 'MEDIUM',
    project: 'pixel-design',
    assignee: 'isla',
    createdBy: 'emma',
  },
  {
    key: 'pixel-testing',
    title: 'Add visual regression tests',
    priority: 'MEDIUM',
    project: 'pixel-design',
    assignee: 'jack',
    createdBy: 'emma',
  },
];

/**
 * --------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------
 */

function findByEmail(items, email) {
  return items.find((item) => item.email === email);
}

function findByName(items, name) {
  return items.find((item) => item.name === name);
}

function printAction(action, entity, reused) {
  const prefix = reused ? '↻' : '✓';

  console.log(`  ${prefix} ${action}: ${entity.name} -> ${entity.id}`);
}

/**
 * --------------------------------------------------------------------------
 * Main
 * --------------------------------------------------------------------------
 */

async function main() {
  console.log('');
  console.log('==========================================');
  console.log(' TeamFlow GraphQL Seed');
  console.log('==========================================');
  console.log(`GraphQL endpoint: ${GRAPHQL_URL}`);
  console.log('');
  console.log('Mode: idempotent');
  console.log('Existing records will be reused.');
  console.log('');

  const result = {
    generatedAt: new Date().toISOString(),
    graphqlUrl: GRAPHQL_URL,

    users: {},
    organizations: {},
    teams: {},
    projects: {},
    tasks: {},
  };

  /**
   * ------------------------------------------------------------------------
   * Users
   * ------------------------------------------------------------------------
   */

  console.log('Loading existing users...');

  const existingUsers = await getUsers();

  console.log(`Found ${existingUsers.length} existing users.`);

  console.log('');
  console.log('Creating/reusing users...');

  for (const definition of users) {
    let user = findByEmail(existingUsers, definition.email);
    let reused = true;

    if (!user) {
      user = await createUser(definition);
      reused = false;

      existingUsers.push(user);
    }

    result.users[definition.key] = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    printAction('User', user, reused);
  }

  /**
   * ------------------------------------------------------------------------
   * Organizations
   * ------------------------------------------------------------------------
   */

  console.log('');
  console.log('Loading existing organizations...');

  const existingOrganizations = await getOrganizations();

  console.log(`Found ${existingOrganizations.length} existing organizations.`);

  console.log('');
  console.log('Creating/reusing organizations...');

  for (const definition of organizationDefinitions) {
    let organization = findByName(existingOrganizations, definition.name);

    let reused = true;

    if (!organization) {
      organization = await createOrganization({
        name: definition.name,
        ownerId: result.users[definition.owner].id,
      });

      reused = false;
      existingOrganizations.push(organization);
    }

    result.organizations[definition.key] = {
      id: organization.id,
      name: organization.name,
      status: organization.status,
      owner: definition.owner,
      ownerId: result.users[definition.owner].id,
    };

    printAction('Organization', organization, reused);
  }

  /**
   * ------------------------------------------------------------------------
   * Teams
   * ------------------------------------------------------------------------
   */

  console.log('');
  console.log('Creating/reusing teams...');

  for (const organizationDefinition of organizationDefinitions) {
    const organization = result.organizations[organizationDefinition.key];

    const existingTeams = await getTeams(organization.id);

    result.teams[organizationDefinition.key] = {};

    for (const teamName of teamNames) {
      let team = findByName(existingTeams, teamName);
      let reused = true;

      if (!team) {
        team = await createTeam({
          organizationId: organization.id,
          name: teamName,
        });

        reused = false;
        existingTeams.push(team);
      }

      const teamKey = teamName.toLowerCase();

      result.teams[organizationDefinition.key][teamKey] = {
        id: team.id,
        name: team.name,
        status: team.status,
        organizationId: organization.id,
        organization: organizationDefinition.key,
      };

      printAction(`Team [${organization.name}]`, team, reused);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Projects
   * ------------------------------------------------------------------------
   */

  console.log('');
  console.log('Creating/reusing projects...');

  for (const definition of projectDefinitions) {
    const organization = result.organizations[definition.organization];

    const existingProjects = await getProjects(organization.id);

    let project = findByName(existingProjects, definition.name);

    let reused = true;

    if (!project) {
      project = await createProject({
        organizationId: organization.id,
        name: definition.name,
        description: definition.description,
        ownerId: result.users[definition.owner].id,
      });

      reused = false;
      existingProjects.push(project);
    }

    result.projects[definition.key] = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,

      organizationId: organization.id,
      organization: definition.organization,

      ownerId: project.ownerId,
      owner: definition.owner,
    };

    printAction('Project', project, reused);
  }

  /**
   * ------------------------------------------------------------------------
   * Tasks
   * ------------------------------------------------------------------------
   */

  console.log('');
  console.log('Creating/reusing tasks...');

  /**
   * We group task lookup by project.
   *
   * This prevents us from executing tasksByProject once for every task.
   *
   * 50 tasks
   * ↓
   * 10 project queries
   *
   * instead of:
   *
   * 50 tasks
   * ↓
   * 50 project queries
   */

  const tasksByProject = new Map();

  for (const definition of taskDefinitions) {
    if (!tasksByProject.has(definition.project)) {
      const project = result.projects[definition.project];

      const existingTasks = await getTasks(project.id);

      tasksByProject.set(definition.project, existingTasks);
    }
  }

  for (const definition of taskDefinitions) {
    const project = result.projects[definition.project];

    const existingTasks = tasksByProject.get(definition.project);

    let task = findByName(existingTasks, definition.title);

    let reused = true;

    if (!task) {
      task = await createTask({
        projectId: project.id,
        title: definition.title,
        priority: definition.priority,
        assigneeId: result.users[definition.assignee].id,
        createdById: result.users[definition.createdBy].id,
      });

      reused = false;
      existingTasks.push(task);
    }

    result.tasks[definition.key] = {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,

      projectId: task.projectId,
      project: definition.project,

      assigneeId: task.assigneeId,
      assignee: definition.assignee,

      createdById: task.createdById,
      createdBy: definition.createdBy,
    };

    printAction('Task', task, reused);
  }

  /**
   * ------------------------------------------------------------------------
   * Save generated IDs
   * ------------------------------------------------------------------------
   */

  await mkdir(dirname(OUTPUT_FILE), {
    recursive: true,
  });

  await writeFile(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  /**
   * ------------------------------------------------------------------------
   * Summary
   * ------------------------------------------------------------------------
   */

  const teamCount = Object.values(result.teams).reduce(
    (total, organizationTeams) => total + Object.keys(organizationTeams).length,
    0,
  );

  console.log('');
  console.log('==========================================');
  console.log(' Seed completed');
  console.log('==========================================');

  console.log(`Users:         ${Object.keys(result.users).length}`);

  console.log(`Organizations: ${Object.keys(result.organizations).length}`);

  console.log(`Teams:         ${teamCount}`);

  console.log(`Projects:      ${Object.keys(result.projects).length}`);

  console.log(`Tasks:         ${Object.keys(result.tasks).length}`);

  console.log('');
  console.log(`Data saved to: ${OUTPUT_FILE}`);
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('❌ TeamFlow seed failed');
  console.error('');
  console.error(error);
  console.error('');
  process.exitCode = 1;
});
