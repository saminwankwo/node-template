/* eslint-disable no-await-in-loop */
const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const { ulid } = require('@app-core/randomness');
const CreatorCard = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');

const spec = `root {
  title string<trim|minLength:3|maxLength:100>
  description? string<trim|maxLength:500>
  slug? string<trim|minLength:5|maxLength:50>
  creator_reference string<trim|length:20>
  links[]? {
    title string<trim|minLength:1|maxLength:100>
    url string<trim|maxLength:200>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|minLength:3|maxLength:100>
      description? string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<trim|length:6>
}`;

const parsedSpec = validator.parse(spec);

function generateRandomAlphanumeric(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateSlugFromTitle(title) {
  let slug = title.toLowerCase();
  slug = slug.split(' ').join('-');
  let cleaned = '';
  for (let i = 0; i < slug.length; i++) {
    const char = slug[i];
    if (
      (char >= 'a' && char <= 'z') ||
      (char >= '0' && char <= '9') ||
      char === '-' ||
      char === '_'
    ) {
      cleaned += char;
    }
  }
  return cleaned;
}

async function createCard(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    // Validate access_code rules
    if (data.access_type === 'private' && !data.access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, ERROR_CODE.AC01);
    }

    if (data.access_type !== 'private' && data.access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_INVALID_ON_PUBLIC, ERROR_CODE.AC05);
    }

    // Validate URLs start with http:// or https://
    if (data.links) {
      data.links.forEach((link) => {
        if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
          throwAppError('URL must start with http:// or https://', ERROR_CODE.INVLDATA);
        }
      });
    }

    let { slug } = data;
    if (!slug) {
      // Generate slug from title
      const baseSlug = generateSlugFromTitle(data.title);
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        let candidateSlug = baseSlug;

        // If base slug is too short or it's not the first attempt, add suffix
        if (candidateSlug.length < 5 || attempts > 0) {
          candidateSlug = `${baseSlug}-${generateRandomAlphanumeric(6)}`;
        }

        const existing = await CreatorCard.findOne({ query: { slug: candidateSlug } });
        if (!existing) {
          slug = candidateSlug;
          break;
        }

        attempts++;
      }

      if (!slug) {
        throwAppError('Failed to generate unique slug', ERROR_CODE.INVLDATA);
      }
    } else {
      const existing = await CreatorCard.findOne({ query: { slug } });
      if (existing) {
        throwAppError(CreatorCardMessages.SLUG_ALREADY_TAKEN, ERROR_CODE.SL02);
      }
    }

    const now = Date.now();
    const newCard = await CreatorCard.create({
      _id: ulid(),
      title: data.title,
      description: data.description,
      slug,
      creator_reference: data.creator_reference,
      links: data.links,
      service_rates: data.service_rates,
      status: data.status,
      access_type: data.access_type || 'public',
      access_code: data.access_code,
      created: now,
      updated: now,
    });

    response = {
      id: newCard._id,
      title: newCard.title,
      description: newCard.description,
      slug: newCard.slug,
      creator_reference: newCard.creator_reference,
      links: newCard.links,
      service_rates: newCard.service_rates,
      status: newCard.status,
      access_type: newCard.access_type,
      access_code: newCard.access_code,
      created: newCard.created,
      updated: newCard.updated,
      deleted: newCard.deleted,
    };
  } catch (error) {
    appLogger.errorX(error, 'create-creator-card-error');
    throw error;
  }

  return response;
}

module.exports = createCard;
