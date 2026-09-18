import { GraphQLError, GraphQLFormattedError } from 'graphql/error';

export function formatGraphQLError(error: GraphQLError): GraphQLFormattedError {
  const extensions = error.extensions ?? {};
  const code =
    typeof extensions.code === 'string'
      ? extensions.code
      : 'INTERNAL_SERVER_ERROR';
  if (code === 'UNAUTHENTICATED') {
    return {
      message: 'Authentication required',
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    };
  }
  if (code === 'FORBIDDEN') {
    return {
      message: 'You do not have permission to perform this action',
      extensions: {
        code: 'FORBIDDEN',
      },
    };
  }
  if (code === 'BAD_USER_INPUT') {
    return {
      message: error.message,
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    };
  }
  return {
    message: 'Internal server error',
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  };
}
